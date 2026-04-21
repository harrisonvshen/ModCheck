/**
 * Curated list of popular vehicles for quick selection in the Profile form.
 * Used to populate year/make/model with one tap instead of three inputs.
 */

export interface VehiclePreset {
  label: string;
  year: number;
  make: string;
  model: string;
}

export const VEHICLE_PRESETS: VehiclePreset[] = [
  // Enthusiast favorites
  { label: '2024 Honda Civic Si', year: 2024, make: 'Honda', model: 'Civic Si' },
  { label: '2024 Subaru WRX', year: 2024, make: 'Subaru', model: 'WRX' },
  { label: '2023 Ford Mustang GT', year: 2023, make: 'Ford', model: 'Mustang GT' },
  { label: '2024 Chevrolet Camaro', year: 2024, make: 'Chevrolet', model: 'Camaro' },
  { label: '2022 Dodge Charger R/T', year: 2022, make: 'Dodge', model: 'Charger R/T' },
  { label: '2023 BMW M3', year: 2023, make: 'BMW', model: 'M3' },
  { label: '2024 Toyota GR Corolla', year: 2024, make: 'Toyota', model: 'GR Corolla' },
  { label: '2024 Hyundai Elantra N', year: 2024, make: 'Hyundai', model: 'Elantra N' },

  // Popular commuters
  { label: '2024 Honda Civic', year: 2024, make: 'Honda', model: 'Civic' },
  { label: '2024 Toyota Camry', year: 2024, make: 'Toyota', model: 'Camry' },
  { label: '2023 Honda Accord', year: 2023, make: 'Honda', model: 'Accord' },
  { label: '2024 Toyota Corolla', year: 2024, make: 'Toyota', model: 'Corolla' },
  { label: '2023 Mazda 3', year: 2023, make: 'Mazda', model: '3' },

  // Trucks
  { label: '2024 Ford F-150', year: 2024, make: 'Ford', model: 'F-150' },
  { label: '2024 RAM 1500', year: 2024, make: 'RAM', model: '1500' },
  { label: '2024 Chevrolet Silverado', year: 2024, make: 'Chevrolet', model: 'Silverado' },
  { label: '2024 Toyota Tacoma', year: 2024, make: 'Toyota', model: 'Tacoma' },
  { label: '2024 Toyota Tundra', year: 2024, make: 'Toyota', model: 'Tundra' },

  // SUVs / Jeeps
  { label: '2024 Jeep Wrangler', year: 2024, make: 'Jeep', model: 'Wrangler' },
  { label: '2024 Jeep Grand Cherokee', year: 2024, make: 'Jeep', model: 'Grand Cherokee' },
  { label: '2024 Ford Bronco', year: 2024, make: 'Ford', model: 'Bronco' },
  { label: '2024 Honda CR-V', year: 2024, make: 'Honda', model: 'CR-V' },
  { label: '2024 Toyota RAV4', year: 2024, make: 'Toyota', model: 'RAV4' },

  // EVs
  { label: '2024 Tesla Model 3', year: 2024, make: 'Tesla', model: 'Model 3' },
  { label: '2024 Tesla Model Y', year: 2024, make: 'Tesla', model: 'Model Y' },
  { label: '2024 Ford Mustang Mach-E', year: 2024, make: 'Ford', model: 'Mustang Mach-E' },
];
