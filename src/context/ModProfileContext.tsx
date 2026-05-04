import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, TintDetails, ExhaustDetails, SuspensionDetails } from '../types';
import { parseShareParams, getCurrentSearch } from '../utils/shareUrl';

export type CheckContext = 'registering' | 'visiting';

interface ModProfile {
  vehicle: Omit<Vehicle, 'id'>;
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
  homeStateAbbreviation: string | null;
  /**
   * 'registering' = the user lives in / is registering the car in this state
   *   (strictest interpretation, all rules apply).
   * 'visiting' = the user is just driving through with an out-of-state plate
   *   (most equipment laws aren't enforced on visitors per state reciprocity).
   */
  checkContext: CheckContext;
  saved: boolean;
}

interface ModProfileContextValue {
  profile: ModProfile;
  setVehicle: (v: Omit<Vehicle, 'id'>) => void;
  setTint: (t: TintDetails) => void;
  setExhaust: (e: ExhaustDetails) => void;
  setSuspension: (s: SuspensionDetails) => void;
  setHomeState: (abbreviation: string | null) => void;
  setCheckContext: (ctx: CheckContext) => void;
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
  checkContext: 'registering',
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
      checkContext:
        parsed.checkContext === 'visiting' ? 'visiting' : 'registering',
      saved: !!parsed.saved,
    };
  } catch {
    return null;
  }
}

export function ModProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ModProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage on mount, then apply URL params if present
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const stored = parseStoredProfile(raw);
        // Start from stored (or default) profile
        let next: ModProfile = stored ?? DEFAULT_PROFILE;

        // Apply URL share params on top (web only, ignored on native)
        const shareParams = parseShareParams(getCurrentSearch());
        if (shareParams) {
          next = {
            ...next,
            tint: shareParams.tint ?? next.tint,
            exhaust: shareParams.exhaust ?? next.exhaust,
            suspension: shareParams.suspension ?? next.suspension,
          };
        }

        if (!cancelled) setProfile(next);
      } catch (err) {
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

  const setCheckContext = (ctx: CheckContext) =>
    setProfile((p) => ({ ...p, checkContext: ctx }));

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
        setCheckContext,
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
