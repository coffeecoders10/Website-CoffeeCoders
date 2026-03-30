import data from "./website-details.json";

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  github?: string;
  website?: string;
}

export interface Project {
  tag: string;
  title: string;
  body: string;
  cta: string;
  href?: string;
}

export const SOCIALS = data.socials;
export const ABOUT: string = data.about;
export const STATS: Stat[] = data.stats;
export const TEAM: TeamMember[] = data.team;
export const LIVE_PROJECTS: Project[] = data.live_projects;
export const PROJECTS: Project[] = data.projects;
