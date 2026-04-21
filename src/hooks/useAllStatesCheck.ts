import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { TintDetails, ExhaustDetails, SuspensionDetails, Verdict, VerdictResult } from '../types';
import { checkTintLegality, TintLawRow } from '../utils/checkTint';
import { checkExhaustLegality, ExhaustLawRow } from '../utils/checkExhaust';
import { checkSuspensionLegality, SuspensionLawRow } from '../utils/checkSuspension';

const FETCH_TIMEOUT_MS = 10000;

/**
 * Normalize Supabase's join result (sometimes object, sometimes array).
 * Each tint/exhaust/suspension row has at most one state.
 */
function normalizeStates(
  raw: unknown,
): { id: string; name: string; abbreviation: string } | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as { id: string; name: string; abbreviation: string }) ?? null;
  return raw as { id: string; name: string; abbreviation: string };
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
    Promise.resolve(promise).then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

export interface StateVerdict {
  id: string;
  name: string;
  abbreviation: string;
  worstVerdict: Verdict;
}

interface ModProfile {
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
}

function getWorstVerdict(verdicts: VerdictResult[]): Verdict {
  let worst: Verdict = 'green';
  for (const v of verdicts) {
    if (v.verdict === 'red') return 'red';
    if (v.verdict === 'yellow') worst = 'yellow';
  }
  return worst;
}

/**
 * Fetches all states + all mod law tables from Supabase and checks the user's
 * mod values against each state. Returns an array of StateVerdict objects.
 */
export function useAllStatesCheck(mods: ModProfile) {
  const [results, setResults] = useState<StateVerdict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Fetch tint laws (always) — with timeout so we don't hang forever
    let tintData: any;
    let tintErr: any;
    try {
      const resp = await withTimeout(
        supabase
          .from('tint_laws')
          .select(`
            front_side_vlt, rear_side_vlt, rear_window_vlt,
            windshield_strip, fine_first_offense, notes,
            states ( id, name, abbreviation )
          `)
          .order('state_id'),
        FETCH_TIMEOUT_MS,
      );
      tintData = resp.data;
      tintErr = resp.error;
    } catch (e: any) {
      setError(
        e?.message?.includes('timed out')
          ? "Can't reach the database. Check your connection and try again."
          : 'Failed to load tint laws: ' + (e?.message ?? 'unknown error'),
      );
      setLoading(false);
      return;
    }

    if (tintErr || !tintData || tintData.length === 0) {
      setError('Failed to load tint laws: ' + (tintErr?.message ?? 'no data'));
      setLoading(false);
      return;
    }

    // Fetch exhaust laws (only if not stock)
    let exhaustMap = new Map<string, ExhaustLawRow>();
    if (mods.exhaust.type !== 'stock') {
      const { data: exhaustData, error: exhaustErr } = await supabase
        .from('exhaust_laws')
        .select(`
          max_decibels, muffler_required, cat_delete_legal,
          straight_pipe_legal, fine_first_offense, notes,
          states ( id, name, abbreviation )
        `)
        .order('state_id');

      if (exhaustErr) {
        console.error('[ModCheck] Failed to load exhaust_laws:', exhaustErr.message);
      } else if (!exhaustData || exhaustData.length === 0) {
        console.warn('[ModCheck] exhaust_laws returned no rows — check RLS policy.');
      } else {
        for (const row of exhaustData as any[]) {
          const s = normalizeStates(row?.states);
          if (s?.id) {
            exhaustMap.set(s.id, { ...row, states: s });
          }
        }
      }
    }

    // Fetch suspension laws (only if not stock)
    let suspMap = new Map<string, SuspensionLawRow>();
    if (mods.suspension.type !== 'stock') {
      const { data: suspData, error: suspErr } = await supabase
        .from('suspension_laws')
        .select(`
          max_lift_inches, max_bumper_height_front, max_bumper_height_rear,
          frame_height_limit, lowering_restrictions, fine_first_offense, notes,
          states ( id, name, abbreviation )
        `)
        .order('state_id');

      if (suspErr) {
        console.error('[ModCheck] Failed to load suspension_laws:', suspErr.message);
      } else if (!suspData || suspData.length === 0) {
        console.warn('[ModCheck] suspension_laws returned no rows — check RLS policy.');
      } else {
        for (const row of suspData as any[]) {
          const s = normalizeStates(row?.states);
          if (s?.id) {
            suspMap.set(s.id, { ...row, states: s });
          }
        }
      }
    }

    // Build verdicts per state
    const verdicts: StateVerdict[] = [];
    for (const row of tintData as any[]) {
      const s = normalizeStates(row?.states);
      if (!s?.id) continue;

      const allChecks: VerdictResult[] = [];

      const tintLaw: TintLawRow = { ...row, states: s };
      allChecks.push(...checkTintLegality(mods.tint, tintLaw));

      // Exhaust checks
      const exhaustLaw = exhaustMap.get(s.id);
      if (exhaustLaw) {
        allChecks.push(...checkExhaustLegality(mods.exhaust, exhaustLaw));
      }

      // Suspension checks
      const suspLaw = suspMap.get(s.id);
      if (suspLaw) {
        allChecks.push(...checkSuspensionLegality(mods.suspension, suspLaw));
      }

      verdicts.push({
        id: s.id,
        name: s.name,
        abbreviation: s.abbreviation,
        worstVerdict: getWorstVerdict(allChecks),
      });
    }

    verdicts.sort((a, b) => a.name.localeCompare(b.name));
    setResults(verdicts);
    setLoading(false);
  }, [
    mods.tint.front_side_vlt,
    mods.tint.rear_side_vlt,
    mods.tint.rear_window_vlt,
    mods.exhaust.type,
    mods.exhaust.estimated_decibels,
    mods.exhaust.catalytic_converter,
    mods.exhaust.muffler,
    mods.suspension.type,
    mods.suspension.inches,
    mods.suspension.bumper_height_front,
    mods.suspension.bumper_height_rear,
  ]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  return { results, loading, error, refresh: runCheck };
}
