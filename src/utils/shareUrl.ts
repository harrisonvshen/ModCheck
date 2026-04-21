import { Platform } from 'react-native';
import { TintDetails, ExhaustDetails, SuspensionDetails } from '../types';

export interface ShareableProfile {
  tint: TintDetails;
  exhaust: ExhaustDetails;
  suspension: SuspensionDetails;
  stateAbbreviation?: string | null;
}

/**
 * Build a URL search-param string that encodes the user's mod profile
 * (and optionally a selected state). Short key names keep the URL compact.
 */
export function buildShareUrl(base: string, profile: ShareableProfile): string {
  const params = new URLSearchParams();

  if (profile.stateAbbreviation) params.set('s', profile.stateAbbreviation);

  // Tint
  params.set('ft', String(profile.tint.front_side_vlt));
  params.set('rs', String(profile.tint.rear_side_vlt));
  params.set('rw', String(profile.tint.rear_window_vlt));
  if (profile.tint.windshield_strip && profile.tint.windshield_strip !== 'none') {
    params.set('ws', profile.tint.windshield_strip);
  }

  // Exhaust (only if not stock to keep URL short)
  if (profile.exhaust.type !== 'stock') {
    params.set('et', profile.exhaust.type);
    if (profile.exhaust.estimated_decibels !== null) {
      params.set('ed', String(profile.exhaust.estimated_decibels));
    }
    params.set('ec', profile.exhaust.catalytic_converter ? '1' : '0');
    params.set('em', profile.exhaust.muffler ? '1' : '0');
  }

  // Suspension (only if not stock)
  if (profile.suspension.type !== 'stock') {
    params.set('st', profile.suspension.type);
    params.set('si', String(profile.suspension.inches));
    if (profile.suspension.bumper_height_front !== null) {
      params.set('sbf', String(profile.suspension.bumper_height_front));
    }
    if (profile.suspension.bumper_height_rear !== null) {
      params.set('sbr', String(profile.suspension.bumper_height_rear));
    }
  }

  return `${base}?${params.toString()}`;
}

/**
 * Parse URL search params into a partial ShareableProfile.
 * Returns null if no meaningful params are present.
 */
export function parseShareParams(search: string): Partial<ShareableProfile> | null {
  if (!search || search.length <= 1) return null;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  const hasAny = ['s', 'ft', 'rs', 'rw', 'et', 'st'].some((k) => params.has(k));
  if (!hasAny) return null;

  const out: Partial<ShareableProfile> = {};

  if (params.has('s')) out.stateAbbreviation = params.get('s');

  const parseInt = (v: string | null, fallback: number): number => {
    if (v === null) return fallback;
    const n = Number.parseInt(v, 10);
    return Number.isNaN(n) ? fallback : Math.max(0, Math.min(100, n));
  };

  if (params.has('ft') || params.has('rs') || params.has('rw') || params.has('ws')) {
    out.tint = {
      front_side_vlt: parseInt(params.get('ft'), 70),
      rear_side_vlt: parseInt(params.get('rs'), 70),
      rear_window_vlt: parseInt(params.get('rw'), 70),
      windshield_strip: params.get('ws') ?? 'none',
    };
  }

  if (params.has('et')) {
    const type = params.get('et') as ExhaustDetails['type'];
    const validTypes: ExhaustDetails['type'][] = [
      'stock',
      'cat-back',
      'axle-back',
      'straight-pipe',
      'muffler-delete',
    ];
    if (validTypes.includes(type)) {
      out.exhaust = {
        type,
        estimated_decibels: params.has('ed') ? Number.parseInt(params.get('ed')!, 10) : null,
        catalytic_converter: params.get('ec') !== '0',
        muffler: params.get('em') !== '0',
      };
    }
  }

  if (params.has('st')) {
    const type = params.get('st') as SuspensionDetails['type'];
    const validTypes: SuspensionDetails['type'][] = ['stock', 'lift', 'lowered'];
    if (validTypes.includes(type)) {
      out.suspension = {
        type,
        inches: Number.parseInt(params.get('si') ?? '0', 10) || 0,
        bumper_height_front: params.has('sbf') ? Number.parseInt(params.get('sbf')!, 10) : null,
        bumper_height_rear: params.has('sbr') ? Number.parseInt(params.get('sbr')!, 10) : null,
      };
    }
  }

  return out;
}

/**
 * Copy text to clipboard. Web uses navigator.clipboard; native would need
 * expo-clipboard but we fall back to a no-op.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (Platform.OS !== 'web') return false;
  try {
    const nav = (globalThis as any).navigator;
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(text);
      return true;
    }
    // Fallback: use a textarea + document.execCommand (older browsers)
    const doc = (globalThis as any).document;
    if (doc) {
      const textarea = doc.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      doc.body.appendChild(textarea);
      textarea.select();
      const ok = doc.execCommand('copy');
      doc.body.removeChild(textarea);
      return !!ok;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Get the base URL for the current page (web only).
 */
export function getBaseUrl(): string {
  if (Platform.OS !== 'web') return 'https://modcheck.app';
  const loc = (globalThis as any).location;
  if (loc) return `${loc.origin}${loc.pathname}`;
  return 'https://modcheck.app';
}

/**
 * Get the current URL search string (web only).
 */
export function getCurrentSearch(): string {
  if (Platform.OS !== 'web') return '';
  const loc = (globalThis as any).location;
  return loc?.search ?? '';
}
