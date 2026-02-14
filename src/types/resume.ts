export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  location?: string;
  links: SocialLink[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Career {
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Project {
  title: string;
  description: string;
  techs: string[];
  link?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  profile: Profile;
  about: string[];
  skills: SkillCategory[];
  careers: Career[];
  projects: Project[];
  educations: Education[];
  certifications: Certification[];
}
