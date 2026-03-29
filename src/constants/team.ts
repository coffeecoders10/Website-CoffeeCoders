export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  github?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Nitish Talekar",
    role: "Co-Founder & Full Stack Engineer",
    bio: "Passionate about building products that matter. Loves clean code, great UI, and a strong cup of coffee.",
    github: "https://github.com/CoffeeCoders",
  },
  {
    name: "Co-Founder",
    role: "Co-Founder & Software Engineer",
    bio: "Systems thinker with a love for elegant architecture. Turns complex problems into simple, scalable solutions.",
    github: "https://github.com/CoffeeCoders",
  },
];
