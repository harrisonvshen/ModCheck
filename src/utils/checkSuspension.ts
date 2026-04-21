import { SuspensionDetails, VerdictResult, Verdict } from '../types';

export interface SuspensionLawRow {
  max_lift_inches: number | null;
  max_bumper_height_front: number | null;
  max_bumper_height_rear: number | null;
  frame_height_limit: string | null;
  lowering_restrictions: string | null;
  fine_first_offense: string | null;
  notes: string | null;
  states: {
    name: string;
    abbreviation: string;
  };
}

export function checkSuspensionLegality(
  userSusp: SuspensionDetails,
  law: SuspensionLawRow,
): VerdictResult[] {
  const stateName = law.states.name;
  const abbr = law.states.abbreviation;
  const results: VerdictResult[] = [];

  // Stock suspension is always legal
  if (userSusp.type === 'stock') {
    results.push({
      category: 'suspension',
      field: 'suspension_type',
      verdict: 'green',
      explanation: `Stock suspension is legal in all states.`,
    });
    return results;
  }

  // Guard: lifted/lowered must have a non-zero inch value to check.
  if ((userSusp.type === 'lift' || userSusp.type === 'lowered') && userSusp.inches <= 0) {
    results.push({
      category: 'suspension',
      field: 'suspension_type',
      verdict: 'yellow',
      explanation: `Enter a ${userSusp.type === 'lift' ? 'lift' : 'lowering'} amount in inches on the Profile tab to get an accurate check for ${stateName}.`,
    });
    return results;
  }

  // 1. Check lift height
  if (userSusp.type === 'lift' && law.max_lift_inches !== null) {
    if (userSusp.inches <= law.max_lift_inches) {
      results.push({
        category: 'suspension',
        field: 'lift_height',
        verdict: 'green',
        explanation: `Your ${userSusp.inches}" lift is within ${abbr}'s ${law.max_lift_inches}" limit.`,
      });
    } else if (userSusp.inches <= law.max_lift_inches + 1) {
      results.push({
        category: 'suspension',
        field: 'lift_height',
        verdict: 'yellow',
        explanation: `Your ${userSusp.inches}" lift is near ${abbr}'s ${law.max_lift_inches}" limit — borderline.`,
      });
    } else {
      results.push({
        category: 'suspension',
        field: 'lift_height',
        verdict: 'red',
        explanation: `Your ${userSusp.inches}" lift exceeds ${abbr}'s ${law.max_lift_inches}" limit.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
      });
    }
  } else if (userSusp.type === 'lift' && law.max_lift_inches === null) {
    results.push({
      category: 'suspension',
      field: 'lift_height',
      verdict: 'green',
      explanation: `${abbr} has no specific lift height limit.`,
    });
  }

  // 2. Check front bumper height
  if (
    userSusp.bumper_height_front !== null &&
    law.max_bumper_height_front !== null
  ) {
    if (userSusp.bumper_height_front <= law.max_bumper_height_front) {
      results.push({
        category: 'suspension',
        field: 'bumper_front',
        verdict: 'green',
        explanation: `Front bumper at ${userSusp.bumper_height_front}" is within ${abbr}'s ${law.max_bumper_height_front}" limit.`,
      });
    } else {
      results.push({
        category: 'suspension',
        field: 'bumper_front',
        verdict: 'red',
        explanation: `Front bumper at ${userSusp.bumper_height_front}" exceeds ${abbr}'s ${law.max_bumper_height_front}" limit.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
      });
    }
  }

  // 3. Check rear bumper height
  if (
    userSusp.bumper_height_rear !== null &&
    law.max_bumper_height_rear !== null
  ) {
    if (userSusp.bumper_height_rear <= law.max_bumper_height_rear) {
      results.push({
        category: 'suspension',
        field: 'bumper_rear',
        verdict: 'green',
        explanation: `Rear bumper at ${userSusp.bumper_height_rear}" is within ${abbr}'s ${law.max_bumper_height_rear}" limit.`,
      });
    } else {
      results.push({
        category: 'suspension',
        field: 'bumper_rear',
        verdict: 'red',
        explanation: `Rear bumper at ${userSusp.bumper_height_rear}" exceeds ${abbr}'s ${law.max_bumper_height_rear}" limit.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
      });
    }
  }

  // 4. Check lowered vehicles
  if (userSusp.type === 'lowered' && law.lowering_restrictions) {
    results.push({
      category: 'suspension',
      field: 'lowered',
      verdict: 'yellow',
      explanation: `${abbr} has lowering restrictions: ${law.lowering_restrictions}. Verify your setup complies.`,
    });
  } else if (userSusp.type === 'lowered') {
    results.push({
      category: 'suspension',
      field: 'lowered',
      verdict: 'green',
      explanation: `${abbr} has no specific restrictions on lowered vehicles.`,
    });
  }

  // If no specific checks produced results (e.g. lift with no law data)
  if (results.length === 0) {
    results.push({
      category: 'suspension',
      field: 'suspension_type',
      verdict: 'green',
      explanation: `No specific suspension restrictions found for ${stateName}.`,
    });
  }

  return results;
}
