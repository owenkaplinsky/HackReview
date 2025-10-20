export interface Submission {
  id: string;
  projectName: string;
  description: string;
  demoLink?: string;
  teamMembers?: string[];
  category: "ineligible" | "filtered" | "promising";
  eligibilityReason?: string;
  overallScore: number;
  rubricScores: Record<string, number>;
  devilsAdvocate: string;
  praiseAgent: string;
  isFavorite: boolean;
  organizerNotes?: string;
}

export interface HackathonReview {
  id: string;
  name: string;
  rubric: string;
  requirements: string;
  schema: any;
  submissions: Submission[];
  createdAt: Date;
}

export interface ProcessingStatus {
  stage:
    | "idle"
    | "generating-schema"
    | "checking-eligibility"
    | "grading-projects"
    | "running-debate"
    | "complete";
  progress: number;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SchemaResponse {
  schema: Record<string, any>;
}

export interface EligibilityResponse {
  eligible: boolean;
  reason: string;
}

export interface GradeResponse {
  scores: Record<string, number>;
  overallScore: number;
  devilsAdvocate: string;
  praiseAgent: string;
  recommendation: "promising" | "filtered" | "ineligible";
}
