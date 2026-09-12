/**
 * Minimal localStorage wrapper used to persist the app session across
 * page reloads. All access is wrapped in try/catch so the app keeps
 * working even in environments where storage is unavailable (private
 * mode, restricted iframes, etc.). Also SSR-safe by checking for
 * the existence of `window` before accessing localStorage.
 */

const PREFIX = 'svg-sprite-generator:';

const isBrowser = typeof window !== 'undefined';

export const loadState = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const saveState = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable; the session simply won't persist.
  }
};

export const removeState = (key: string): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
};
