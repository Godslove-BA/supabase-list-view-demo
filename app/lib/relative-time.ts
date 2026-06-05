const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.round((then - Date.now()) / 1000); // seconds, signed
  for (const [unit, sec] of UNITS) {
    if (Math.abs(diff) >= sec || unit === "second") {
      return rtf.format(Math.round(diff / sec), unit);
    }
  }
  return "";
}
