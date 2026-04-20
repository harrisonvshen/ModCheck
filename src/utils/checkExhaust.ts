import { ExhaustDetails, VerdictResult, Verdict } from '../types';

export interface ExhaustLawRow {
  max_decibels: number | null;
  muffler_required: boolean;
  cat_delete_legal: boolean;
  straight_pipe_legal: boolean;
  fine_first_offense: string | null;
  notes: string | null;
  states: {
    name: string;
    abbreviation: string;
  };
}

export function checkExhaustLegality(
  userExhaust: ExhaustDetails,
  law: ExhaustLawRow,
): VerdictResult[] {
  const stateName = law.states.name;
  const abbr = law.states.abbreviation;
  const results: VerdictResult[] = [];

  // 1. Check muffler requirement
  if (law.muffler_required && !userExhaust.muffler) {
    results.push({
      category: 'exhaust',
      field: 'muffler',
      verdict: 'red',
      explanation: `${abbr} requires a muffler. Your setup has no muffler installed.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
    });
  } else {
    results.push({
      category: 'exhaust',
      field: 'muffler',
      verdict: 'green',
      explanation: law.muffler_required
        ? `Your muffler is installed — legal in ${stateName}.`
        : `${abbr} does not specifically require a muffler.`,
    });
  }

  // 2. Check catalytic converter
  if (!userExhaust.catalytic_converter && !law.cat_delete_legal) {
    results.push({
      category: 'exhaust',
      field: 'catalytic_converter',
      verdict: 'red',
      explanation: `Catalytic converter delete is illegal in ${stateName}. ${abbr} requires a functioning catalytic converter.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
    });
  } else {
    results.push({
      category: 'exhaust',
      field: 'catalytic_converter',
      verdict: 'green',
      explanation: userExhaust.catalytic_converter
        ? `Catalytic converter installed — legal in ${stateName}.`
        : `${abbr} allows catalytic converter removal.`,
    });
  }

  // 3. Check straight pipe
  if (
    (userExhaust.type === 'straight-pipe') &&
    !law.straight_pipe_legal
  ) {
    results.push({
      category: 'exhaust',
      field: 'straight_pipe',
      verdict: 'red',
      explanation: `Straight pipe exhaust is illegal in ${stateName}.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
    });
  } else if (userExhaust.type === 'straight-pipe' && law.straight_pipe_legal) {
    results.push({
      category: 'exhaust',
      field: 'straight_pipe',
      verdict: 'yellow',
      explanation: `Straight pipe is technically allowed in ${abbr}, but may attract enforcement attention.`,
    });
  }

  // 4. Check decibels (only if user provided an estimate AND state has a limit)
  if (userExhaust.estimated_decibels !== null && law.max_decibels !== null) {
    if (userExhaust.estimated_decibels <= law.max_decibels) {
      results.push({
        category: 'exhaust',
        field: 'decibels',
        verdict: 'green',
        explanation: `Your ${userExhaust.estimated_decibels} dB is within ${abbr}'s ${law.max_decibels} dB limit.`,
      });
    } else if (userExhaust.estimated_decibels <= law.max_decibels + 5) {
      results.push({
        category: 'exhaust',
        field: 'decibels',
        verdict: 'yellow',
        explanation: `Your ${userExhaust.estimated_decibels} dB is close to ${abbr}'s ${law.max_decibels} dB limit — borderline.`,
      });
    } else {
      results.push({
        category: 'exhaust',
        field: 'decibels',
        verdict: 'red',
        explanation: `Your ${userExhaust.estimated_decibels} dB exceeds ${abbr}'s ${law.max_decibels} dB limit.${law.fine_first_offense ? ` Fine: ${law.fine_first_offense}.` : ''}`,
      });
    }
  }

  return results;
}
