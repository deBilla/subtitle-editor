const pad = (n: number): string => String(n).padStart(2, '0');

/** Formats seconds as HH:MM:SS.mmm (VTT-style) */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${String(ms).padStart(3, '0')}`;
}

/** Formats seconds as HH:MM:SS,mmm (SRT-style) */
export function formatTimeSRT(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${String(ms).padStart(3, '0')}`;
}

/**
 * Parses a time string (HH:MM:SS.mmm or HH:MM:SS,mmm) to seconds.
 * Returns null if the string is not a valid time.
 */
export function parseTime(str: string): number | null {
  const normalized = str.trim().replace(',', '.');
  const match = normalized.match(/^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!match) return null;

  const [, hh, mm, ss, frac] = match as [string, string, string, string, string | undefined];
  const ms = frac ? parseInt(frac.padEnd(3, '0'), 10) : 0;
  return (
    parseInt(hh, 10) * 3600 +
    parseInt(mm, 10) * 60 +
    parseInt(ss, 10) +
    ms / 1000
  );
}
