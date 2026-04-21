import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, TintDetails, ExhaustDetails, SuspensionDetails } from '../types';

interface ModProfile {
  vehicle: Omit<Vehicle, 'id'>;
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
  homeStateAbbreviation: string | null;
  saved: boolean;
}

interface ModProfileContextValue {
  profile: ModProfile;
  setVehicle: (v: Omit<Vehicle, 'id'>) => void;
  setTint: (t: TintDetails) => void;
  setExhaust: (e: ExhaustDetails) => void;
  setSuspension: (s: SuspensionDetails) => void;
  setHomeState: (abbreviation: string | null) => void;
  markSaved: () => void;
  markUnsaved: () => void;
  resetProfile: () => void;
  hydrated: boolean;
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
  homeStateAbbreviation: null,
  saved: false,
};

const STORAGE_KEY = '@modcheck/profile/v1';

const ModProfileContext = createContext<ModProfileContextValue | null>(null);

/**
 * Validates that a parsed object matches the expected ModProfile shape.
 * Returns null if invalid (so we fall back to defaults).
 */
function parseStoredProfile(raw: string | null): ModProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Shallow validation: check expected keys exist
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.vehicle ||
      !parsed.tint ||
      !parsed.exhaust ||
      !parsed.suspension
    ) {
      return null;
    }
    // Merge with defaults to ensure new fields are populated
    return {
      vehicle: { ...DEFAULT_PROFILE.vehicle, ...parsed.vehicle },
      tint: { ...DEFAULT_PROFILE.tint, ...parsed.tint },
      exhaust: { ...DEFAULT_PROFILE.exhaust, ...parsed.exhaust },
      suspension: { ...DEFAULT_PROFILE.suspension, ...parsed.suspension },
      homeStateAbbreviation:
        typeof parsed.homeStateAbbreviation === 'string'
          ? parsed.homeStateAbbreviation
          : null,
      saved: !!parsed.saved,
    };
  } catch {
    return null;
  }
}

export function ModProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ModProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = parseStoredProfile(raw);
        if (parsed && !cancelled) {
          setProfile(parsed);
        }
      } catch (err) {
        // Silently ignore — fall back to defaults
        console.warn('Failed to hydrate profile', err);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile)).catch((err) => {
      console.warn('Failed to persist profile', err);
    });
  }, [profile, hydrated]);

  const setVehicle = (vehicle: Omit<Vehicle, 'id'>) =>
    setProfile((p) => ({ ...p, vehicle, saved: false }));

  const setTint = (tint: TintDetails) =>
    setProfile((p) => ({ ...p, tint, saved: false }));

  const setExhaust = (exhaust: ExhaustDetails) =>
    setProfile((p) => ({ ...p, exhaust, saved: false }));

  const setSuspension = (suspension: SuspensionDetails) =>
    setProfile((p) => ({ ...p, suspension, saved: false }));

  const setHomeState = (abbreviation: string | null) =>
    setProfile((p) => ({ ...p, homeStateAbbreviation: abbreviation }));

  const markSaved = () => setProfile((p) => ({ ...p, saved: true }));
  const markUnsaved = () => setProfile((p) => ({ ...p, saved: false }));
  const resetProfile = () => setProfile(DEFAULT_PROFILE);

  return (
    <ModProfileContext.Provider
      value={{
        profile,
        setVehicle,
        setTint,
        setExhaust,
        setSuspension,
        setHomeState,
        markSaved,
        markUnsaved,
        resetProfile,
        hydrated,
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
