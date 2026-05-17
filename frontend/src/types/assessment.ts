export type RiskLevel = "low" | "medium" | "high";
export type AssessmentStatus = "new" | "in_review" | "requires_follow_up" | "cleared" | "not_cleared";
export type UserRole = "clinician" | "admin";

export type ReviewNote = {
  id: number;
  assessment: number;
  author: string;
  content: string;
  created_at: string;
};

export type AuditEvent = {
  id: number;
  action: string;
  actor: string;
  previous_status: AssessmentStatus | "";
  new_status: AssessmentStatus | "";
  created_at: string;
};

export type Assessment = {
  id: number;
  candidate_name: string;
  role_title: string;
  employer_name: string;
  submitted_at: string;
  risk_level: RiskLevel;
  status: AssessmentStatus;
  clinician: string;
  flags: string[];
  flag_count: number;
  summary: string;
};

export type AssessmentDetail = Assessment & {
  notes: ReviewNote[];
  audit_events: AuditEvent[];
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
