export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export const STATS: Stat[] = [
  { label: "Projects Built", value: 12, suffix: "+" },
  { label: "Years Together", value: 6 },
  { label: "Cups of Coffee", value: 1000, suffix: "+" },
  { label: "Lines of Code", value: 50, suffix: "k+" },
];
