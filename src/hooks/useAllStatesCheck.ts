import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { TintDetails, ExhaustDetails, SuspensionDetails, Verdict, VerdictResult } from '../types';
import { checkTintLegality, TintLawRow } from '../utils/checkTint';
import { checkExhaustLegality, ExhaustLawRow } from '../utils/checkExhaust';
import { checkSuspensionLegality, SuspensionLawRow } from '../utils/checkSuspension';

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

    // Fetch tint laws (always)
    const { data: tintData, error: tintErr } = await supabase
      .from('tint_laws')
      .select(`
        front_side_vlt, rear_side_vlt, rear_window_vlt,
        windshield_strip, fine_first_offense, notes,
        states ( id, name, abbreviation )
      `)
      .order('state_id');

    if (tintErr || !tintData || tintData.length === 0) {
      setError('Failed to load tint laws: ' + (tintErr?.message ?? 'no data'));
      setLoading(false);
      return;
    }

    // Fetch exhaust laws (only if not stock)
    let exhaustMap = new Map<string, ExhaustLawRow>();
    if (mods.exhaust.type !== 'stock') {
      const { data: exhaustData } = await supabase
        .from('exhaust_laws')
        .select(`
          max_decibels, muffler_required, cat_delete_legal,
          straight_pipe_legal, fine_first_offense, notes,
          states ( id, name, abbreviation )
        `)
        .order('state_id');

      if (exhaustData) {
        for (const row of exhaustData as any[]) {
          exhaustMap.set(row.states.id, {
            ...row,
            states: row.states as { name: string; abbreviation: string },
          });
        }
      }
    }

    // Fetch suspension laws (only if not stock)
    let suspMap = new Map<string, SuspensionLawRow>();
    if (mods.suspension.type !== 'stock') {
      const { data: suspData } = await supabase
        .from('suspension_laws')
        .select(`
          max_lift_inches, max_bumper_height_front, max_bumper_height_rear,
          frame_height_limit, lowering_restrictions, fine_first_offense, notes,
          states ( id, name, abbreviation )
        `)
        .order('state_id');

      if (suspData) {
        for (const row of suspData as any[]) {
          suspMap.set(row.states.id, {
            ...row,
            states: row.states as { name: string; abbreviation: string },
          });
        }
      }
    }

    // Build verdicts per state
    const verdicts: StateVerdict[] = tintData.map((row: any) => {
      const stateId = row.states.id;
      const allChecks: VerdictResult[] = [];

      // Tint checks
      const tintLaw: TintLawRow = {
        ...row,
        states: row.states as { name: string; abbreviation: string },
      };
      allChecks.push(...checkTintLegality(mods.tint, tintLaw));

      // Exhaust checks
      const exhaustLaw = exhaustMap.get(stateId);
      if (exhaustLaw) {
        allChecks.push(...checkExhaustLegality(mods.exhaust, exhaustLaw));
      }

      // Suspension checks
      const suspLaw = suspMap.get(stateId);
      if (suspLaw) {
        allChecks.push(...checkSuspensionLegality(mods.suspension, suspLaw));
      }

      return {
        id: stateId,
        name: tintLaw.states.name,
        abbreviation: tintLaw.states.abbreviation,
        worstVerdict: getWorstVerdict(allChecks),
      };
    });

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
