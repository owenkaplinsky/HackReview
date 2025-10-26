export interface Submission {
  id: string;
  projectName: string;
  description: string;
  demoLink?: string;
  teamMembers?: string[];
  category: "ineligible" | "filtered" | "promising" | "error" | "pending";
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
  success: boolean;
  data?: {
    schema: Record<string, any>;
  };
  error?: string;
}

export interface EligibilityResponse {
  success: boolean;
  data?: {
    eligible: boolean;
    reason: string;
  };
  error?: string;
}

export interface GradeResponse {
  success: boolean;
  data?: Record<string, any>; // Backend returns complex nested scoring structure
  error?: string;
}
