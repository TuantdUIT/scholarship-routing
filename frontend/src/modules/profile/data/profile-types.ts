export interface UserProfileSummary {
  id: string;
  name: string;
  email: string;
  nationality: string;
  level: string;
  major: string;
  gpa: number | null;
  gpaScale: number | null;
  ielts: number | null;
  gre: number | null;
  avatar?: string | null;
  matchScore: number;
  profileCompleteness: number;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  currentLevel: string;
  dateOfBirth: string;
  address: string;
  bio: string;
}

export type EducationStatus = "completed" | "in-progress" | "planned";

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  major: string;
  gpa: string;
  gpaScale: string;
  startDate: string;
  endDate: string;
  status: EducationStatus;
}

export type TestStatus = "valid" | "expired" | "pending";

export interface TestScore {
  type: string;
  score: string;
  maxScore: number;
  date: string;
  status: TestStatus;
}

export type ExperienceType =
  | "internship"
  | "full-time"
  | "part-time"
  | "volunteer"
  | "research";

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  type: ExperienceType;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skills: string[];
}

export type ActivityType =
  | "volunteer"
  | "leadership"
  | "competition"
  | "club"
  | "sports"
  | "arts"
  | "community";

export interface ActivityEntry {
  id: string;
  title: string;
  organization: string;
  role: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export type PublicationType =
  | "journal"
  | "conference"
  | "workshop"
  | "preprint"
  | "thesis";

export type PublicationStatus =
  | "published"
  | "accepted"
  | "under-review"
  | "draft";

export interface PublicationEntry {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  type: PublicationType;
  status: PublicationStatus;
  doi: string;
  abstract: string;
  url: string;
}

export type DocumentType =
  | "cv"
  | "transcript"
  | "sop"
  | "recommendation"
  | "certificate"
  | "portfolio"
  | "other";

export type DocumentStatus = "uploaded" | "processing" | "verified" | "rejected";

export interface DocumentRequirement {
  value: DocumentType;
  label: string;
  required: boolean;
}

export interface ProfileDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadDate: string;
  size: string;
  url?: string;
}

export interface ParsedCVField {
  field: string;
  value: string;
  confidence: number;
}
