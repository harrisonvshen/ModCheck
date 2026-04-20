import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vehicle, TintDetails, ExhaustDetails, SuspensionDetails } from '../types';

interface ModProfile {
  vehicle: Omit<Vehicle, 'id'>;
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
  saved: boolean;
}

interface ModProfileContextValue {
  profile: ModProfile;
  setVehicle: (v: Omit<Vehicle, 'id'>) => void;
  setTint: (t: TintDetails) => void;
  setExhaust: (e: ExhaustDetails) => void;
  setSuspension: (s: SuspensionDetails) => void;
  markSaved: () => void;
  markUnsaved: () => void;
}

const DEFAULT_PROFILE: ModProfile = {
  vehicle: { year: 0, make: '', model: '', gvwr: null },
  tint: {
    front_side_vlt: 70,
    rear_side_vlt: 70,
    rear_window_vlt: 70,
    windshield_strip: 'none',
  },
  exhaust: {
    type: 'stock',
    estimated_decibels: null,
    catalytic_converter: true,
    muffler: true,
  },
  suspension: {
    type: 'stock',
    inches: 0,
    bumper_height_front: null,
    bumper_height_rear: null,
  },
  saved: false,
};

const ModProfileContext = createContext<ModProfileContextValue | null>(null);

export function ModProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ModProfile>(DEFAULT_PROFILE);

  const setVehicle = (vehicle: Omit<Vehicle, 'id'>) =>
    setProfile((p) => ({ ...p, vehicle, saved: false }));

  const setTint = (tint: TintDetails) =>
    setProfile((p) => ({ ...p, tint, saved: false }));

  const setExhaust = (exhaust: ExhaustDetails) =>
    setProfile((p) => ({ ...p, exhaust, saved: false }));

  const setSuspension = (suspension: SuspensionDetails) =>
    setProfile((p) => ({ ...p, suspension, saved: false }));

  const markSaved = () => setProfile((p) => ({ ...p, saved: true }));
  const markUnsaved = () => setProfile((p) => ({ ...p, saved: false }));

  return (
    <ModProfileContext.Provider
      value={{
        profile,
        setVehicle,
        setTint,
        setExhaust,
        setSuspension,
        markSaved,
        markUnsaved,
      }}
    >
      {children}
    </ModProfileContext.Provider>
  );
}

export function useModProfile() {
  const ctx = useContext(ModProfileContext);
  if (!ctx) throw new Error('useModProfile must be inside ModProfileProvider');
  return ctx;
}
