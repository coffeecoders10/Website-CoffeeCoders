export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  github?: string;
  website?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Nitish Talekar",
    role: "Co-Founder & Full Stack Engineer",
    bio: "Passionate about building products that matter. Loves clean code, great UI, and a strong cup of coffee.",
    avatarSrc: "/nitish-profile.jpg",
    github: "https://github.com/NitishTalekar",
    website: "https://ntidev.vercel.app",
  },
  {
    name: "Sarvesh Wanode",
    role: "Co-Founder & Software Engineer",
    bio: "Systems thinker with a love for elegant architecture. Turns complex problems into simple, scalable solutions.",
    avatarSrc: "/sarvesh-profile.jpg",
    github: "https://github.com/SarveshWanode",
    website: "https://sarveshwanode.vercel.app",
  },
];
