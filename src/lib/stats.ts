export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

/** The team's first project year; "Years" counts up from here. */
export const FOUNDED_YEAR = 2018;

/** Shown as "1000+" and never changes. */
export const CUPS_OF_COFFEE = 1000;

/** Rule of thumb for the "Lines of Code" figure: an average project is about 7,200 lines. */
export const LINES_PER_PROJECT = 7200;

/**
 * The home page stats, calculated rather than stored:
 * - Projects: how many projects are listed (live + other)
 * - Years: calendar years since FOUNDED_YEAR
 * - Cups of coffee: fixed at 1000+
 * - Lines of code: projects x LINES_PER_PROJECT, shown in thousands (e.g. 7 projects -> 50k+)
 */
export function computeStats(projectCount: number, now: Date = new Date()): Stat[] {
  return [
    { label: "Projects Built", value: projectCount },
    { label: "Years", value: Math.max(0, now.getFullYear() - FOUNDED_YEAR) },
    { label: "Cups of Coffee", value: CUPS_OF_COFFEE, suffix: "+" },
    {
      label: "Lines of Code",
      value: Math.round((projectCount * LINES_PER_PROJECT) / 1000),
      suffix: "k+",
    },
  ];
}
