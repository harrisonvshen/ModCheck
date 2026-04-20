export type Verdict = 'green' | 'yellow' | 'red';

export type ModCategory = 'tint' | 'exhaust' | 'suspension';

export interface TintDetails {
  front_side_vlt: number;
  rear_side_vlt: number;
  rear_window_vlt: number;
  windshield_strip: string;
}

export interface ExhaustDetails {
  type: 'stock' | 'cat-back' | 'axle-back' | 'straight-pipe' | 'muffler-delete';
  estimated_decibels: number | null;
  catalytic_converter: boolean;
  muffler: boolean;
}

export interface SuspensionDetails {
  type: 'lift' | 'lowered' | 'stock';
  inches: number;
  bumper_height_front: number | null;
  bumper_height_rear: number | null;
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  gvwr: number | null;
}

export interface VerdictResult {
  category: ModCategory;
  field: string;
  verdict: Verdict;
  explanation: string;
}

export type RootTabParamList = {
  Home: undefined;
  Check: { stateId?: string; stateName?: string } | undefined;
  Profile: undefined;
};
