import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TintDetails, ExhaustDetails, SuspensionDetails, VerdictResult } from '../types';
import { checkTintLegality, TintLawRow } from '../utils/checkTint';
import { checkExhaustLegality, ExhaustLawRow } from '../utils/checkExhaust';
import { checkSuspensionLegality, SuspensionLawRow } from '../utils/checkSuspension';

function normalizeStates(
  raw: unknown,
): { name: string; abbreviation: string } | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as { name: string; abbreviation: string }) ?? null;
  return raw as { name: string; abbreviation: string };
}

interface Mods {
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
}

export interface StateCheckResult {
  verdicts: VerdictResult[];
  tintLawRaw: any | null;
  exhaustLawRaw: any | null;
  suspensionLawRaw: any | null;
}

/**
 * Fetches all law data for a single state and runs the user's mods through
 * the legality checkers. Returns verdicts + raw law rows (for detail display).
 */
export function useStateCheck(stateId: string | null, mods: Mods) {
  const [result, setResult] = useState<StateCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!stateId) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    const verdicts: VerdictResult[] = [];
    const out: StateCheckResult = {
      verdicts: [],
      tintLawRaw: null,
      exhaustLawRaw: null,
      suspensionLawRaw: null,
    };

    try {
      // Tint (always runs — it's always checked against law)
      const { data: tintData } = await supabase
        .from('tint_laws')
        .select(`
          front_side_vlt, rear_side_vlt, rear_window_vlt,
          windshield_strip, reflective_allowed, medical_exemption,
          fine_first_offense, notes,
          states ( name, abbreviation )
        `)
        .eq('state_id', stateId)
        .single();

      if (tintData) {
        out.tintLawRaw = tintData;
        const s = normalizeStates(tintData.states);
        if (s) {
          const law: TintLawRow = {
            front_side_vlt: tintData.front_side_vlt,
            rear_side_vlt: tintData.rear_side_vlt,
            rear_window_vlt: tintData.rear_window_vlt,
            windshield_strip: tintData.windshield_strip,
            fine_first_offense: tintData.fine_first_offense,
            notes: tintData.notes,
            states: s,
          };
          verdicts.push(...checkTintLegality(mods.tint, law));
        }
      }

      // Exhaust (always fetch for display; run verdict only if not stock)
      const { data: exhaustData } = await supabase
        .from('exhaust_laws')
        .select(`
          max_decibels, muffler_required, cat_delete_legal,
          straight_pipe_legal, measurement_method, fine_first_offense, notes,
          states ( name, abbreviation )
        `)
        .eq('state_id', stateId)
        .single();

      if (exhaustData) {
        out.exhaustLawRaw = exhaustData;
        if (mods.exhaust.type !== 'stock') {
          const s = normalizeStates(exhaustData.states);
          if (s) {
            const law: ExhaustLawRow = {
              max_decibels: exhaustData.max_decibels,
              muffler_required: exhaustData.muffler_required,
              cat_delete_legal: exhaustData.cat_delete_legal,
              straight_pipe_legal: exhaustData.straight_pipe_legal,
              fine_first_offense: exhaustData.fine_first_offense,
              notes: exhaustData.notes,
              states: s,
            };
            verdicts.push(...checkExhaustLegality(mods.exhaust, law));
          }
        }
      }

      // Suspension (always fetch for display; run verdict only if not stock)
      const { data: suspData } = await supabase
        .from('suspension_laws')
        .select(`
          max_lift_inches, max_bumper_height_front, max_bumper_height_rear,
          frame_height_limit, lowering_restrictions, fine_first_offense, notes,
          states ( name, abbreviation )
        `)
        .eq('state_id', stateId)
        .single();

      if (suspData) {
        out.suspensionLawRaw = suspData;
        if (mods.suspension.type !== 'stock') {
          const s = normalizeStates(suspData.states);
          if (s) {
            const law: SuspensionLawRow = {
              max_lift_inches: suspData.max_lift_inches,
              max_bumper_height_front: suspData.max_bumper_height_front,
              max_bumper_height_rear: suspData.max_bumper_height_rear,
              frame_height_limit: suspData.frame_height_limit,
              lowering_restrictions: suspData.lowering_restrictions,
              fine_first_offense: suspData.fine_first_offense,
              notes: suspData.notes,
              states: s,
            };
            verdicts.push(...checkSuspensionLegality(mods.suspension, law));
          }
        }
      }

      out.verdicts = verdicts;
      setResult(out);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [
    stateId,
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
    run();
  }, [run]);

  return { result, loading, error, refresh: run };
}
