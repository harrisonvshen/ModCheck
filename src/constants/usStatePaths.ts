/**
 * US State tile map — each state positioned on a 12x8 grid
 * approximating its geographic location. This is the standard
 * "tile grid map" used in data visualization (NPR, FiveThirtyEight style).
 */

export interface StateTile {
  abbreviation: string;
  row: number;
  col: number;
}

export const US_STATE_TILES: StateTile[] = [
  // Row 0
  { abbreviation: 'AK', row: 0, col: 0 },
  { abbreviation: 'ME', row: 0, col: 10 },

  // Row 1
  { abbreviation: 'WI', row: 1, col: 5 },
  { abbreviation: 'VT', row: 1, col: 9 },
  { abbreviation: 'NH', row: 1, col: 10 },

  // Row 2
  { abbreviation: 'WA', row: 2, col: 0 },
  { abbreviation: 'ID', row: 2, col: 1 },
  { abbreviation: 'MT', row: 2, col: 2 },
  { abbreviation: 'ND', row: 2, col: 3 },
  { abbreviation: 'MN', row: 2, col: 4 },
  { abbreviation: 'IL', row: 2, col: 5 },
  { abbreviation: 'MI', row: 2, col: 6 },
  { abbreviation: 'NY', row: 2, col: 8 },
  { abbreviation: 'MA', row: 2, col: 9 },
  { abbreviation: 'CT', row: 2, col: 10 },

  // Row 3
  { abbreviation: 'OR', row: 3, col: 0 },
  { abbreviation: 'NV', row: 3, col: 1 },
  { abbreviation: 'WY', row: 3, col: 2 },
  { abbreviation: 'SD', row: 3, col: 3 },
  { abbreviation: 'IA', row: 3, col: 4 },
  { abbreviation: 'IN', row: 3, col: 5 },
  { abbreviation: 'OH', row: 3, col: 6 },
  { abbreviation: 'PA', row: 3, col: 7 },
  { abbreviation: 'NJ', row: 3, col: 8 },
  { abbreviation: 'RI', row: 3, col: 9 },

  // Row 4
  { abbreviation: 'CA', row: 4, col: 0 },
  { abbreviation: 'UT', row: 4, col: 1 },
  { abbreviation: 'CO', row: 4, col: 2 },
  { abbreviation: 'NE', row: 4, col: 3 },
  { abbreviation: 'MO', row: 4, col: 4 },
  { abbreviation: 'KY', row: 4, col: 5 },
  { abbreviation: 'WV', row: 4, col: 6 },
  { abbreviation: 'VA', row: 4, col: 7 },
  { abbreviation: 'MD', row: 4, col: 8 },
  { abbreviation: 'DE', row: 4, col: 9 },

  // Row 5
  { abbreviation: 'AZ', row: 5, col: 1 },
  { abbreviation: 'NM', row: 5, col: 2 },
  { abbreviation: 'KS', row: 5, col: 3 },
  { abbreviation: 'AR', row: 5, col: 4 },
  { abbreviation: 'TN', row: 5, col: 5 },
  { abbreviation: 'NC', row: 5, col: 6 },
  { abbreviation: 'SC', row: 5, col: 7 },
  { abbreviation: 'DC', row: 5, col: 8 },

  // Row 6
  { abbreviation: 'OK', row: 6, col: 3 },
  { abbreviation: 'LA', row: 6, col: 4 },
  { abbreviation: 'MS', row: 6, col: 5 },
  { abbreviation: 'AL', row: 6, col: 6 },
  { abbreviation: 'GA', row: 6, col: 7 },

  // Row 7
  { abbreviation: 'HI', row: 7, col: 0 },
  { abbreviation: 'TX', row: 7, col: 3 },
  { abbreviation: 'FL', row: 7, col: 8 },
];

// Grid dimensions
export const TILE_GRID_COLS = 11;
export const TILE_GRID_ROWS = 8;
