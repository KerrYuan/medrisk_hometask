import type { AssessmentStatus, RiskLevel, UserRole } from "@/types/assessment";

export type DashboardOrdering = "-submitted_at" | "submitted_at" | "risk_level" | "status";

export type searchParams = {
  risk_level?: RiskLevel;
  status?: AssessmentStatus;
  search?: string;
  ordering?: DashboardOrdering;
  role?: UserRole;
};

export type DashboardQueryUpdates = {
  [K in keyof searchParams]?: searchParams[K] | null;
};

