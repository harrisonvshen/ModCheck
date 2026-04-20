import { TintDetails, VerdictResult, Verdict } from '../types';

/**
 * Database row shape for a tint_laws record joined with its state.
 */
export interface TintLawRow {
  front_side_vlt: number | null;
  rear_side_vlt: number | null;
  rear_window_vlt: number | null;
  windshield_strip: string | null;
  fine_first_offense: string | null;
  notes: string | null;
  states: {
    name: string;
    abbreviation: string;
  };
}

interface WindowCheck {
  field: string;
  label: string;
  userVlt: number;
  lawVlt: number | null;
}

/**
 * Compare the user's tint values against a state's tint law.
 * Returns a VerdictResult per window position.
 *
 * Logic (from the spec):
 *  - law is null → GREEN (any tint allowed)
 *  - user >= law  → GREEN (legal)
 *  - user >= law - 3 → YELLOW (borderline)
 *  - user < law - 3 → RED (illegal)
 */
export function checkTintLegality(
  userTint: TintDetails,
  law: TintLawRow,
): VerdictResult[] {
  const stateName = law.states.name;
  const abbr = law.states.abbreviation;

  const checks: WindowCheck[] = [
    {
      field: 'front_side_vlt',
      label: 'Front Side Windows',
      userVlt: userTint.front_side_vlt,
      lawVlt: law.front_side_vlt,
    },
    {
      field: 'rear_side_vlt',
      label: 'Rear Side Windows',
      userVlt: userTint.rear_side_vlt,
      lawVlt: law.rear_side_vlt,
    },
    {
      field: 'rear_window_vlt',
      label: 'Rear Window',
      userVlt: userTint.rear_window_vlt,
      lawVlt: law.rear_window_vlt,
    },
  ];

  const results: VerdictResult[] = checks.map(({ field, label, userVlt, lawVlt }) => {
    if (lawVlt === null) {
      return {
        category: 'tint' as const,
        field,
        verdict: 'green' as Verdict,
        explanation: `${abbr} has no VLT restriction on ${label.toLowerCase()}. Any darkness is allowed.`,
      };
    }

    if (userVlt >= lawVlt) {
      return {
        category: 'tint' as const,
        field,
        verdict: 'green' as Verdict,
        explanation: `Your ${userVlt}% VLT is legal in ${stateName}. ${abbr} requires ${lawVlt}% minimum.`,
      };
    }

    if (userVlt >= lawVlt - 3) {
      return {
        category: 'tint' as const,
        field,
        verdict: 'yellow' as Verdict,
        explanation: `Your ${userVlt}% VLT is borderline in ${stateName}. ${abbr} requires ${lawVlt}% minimum — you're within the margin of error.`,
      };
    }

    return {
      category: 'tint' as const,
      field,
      verdict: 'red' as Verdict,
      explanation: `Your ${userVlt}% VLT is illegal in ${stateName}. ${abbr} requires ${lawVlt}% minimum.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
    };
  });

  return results;
}
