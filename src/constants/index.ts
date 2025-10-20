// Application constants

export const API_ENDPOINTS = {
  GENERATE_SCHEMA: "/api/generate-schema",
  CHECK_ELIGIBILITY: "/api/check-eligibility",
  GRADE_PROJECT: "/api/grade-project",
} as const;

export const SUBMISSION_CATEGORIES = {
  INELIGIBLE: "ineligible",
  FILTERED: "filtered",
  PROMISING: "promising",
} as const;

export const PROCESSING_STAGES = {
  IDLE: "idle",
  GENERATING_SCHEMA: "generating-schema",
  CHECKING_ELIGIBILITY: "checking-eligibility",
  GRADING_PROJECTS: "grading-projects",
  RUNNING_DEBATE: "running-debate",
  COMPLETE: "complete",
} as const;

export const FILE_TYPES = {
  RUBRIC: {
    "text/plain": [".txt"],
    "application/pdf": [".pdf"],
  },
  SUBMISSIONS: {
    "text/csv": [".csv"],
    "application/json": [".json"],
  },
} as const;

export const SCORE_THRESHOLDS = {
  HIGH: 75,
  MEDIUM: 50,
  LOW: 0,
} as const;
