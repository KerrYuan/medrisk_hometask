import type { AssessmentStatus, RiskLevel } from "@/types/assessment";
import type {
  DashboardOrdering,
  searchParams,
} from "@/types/queryParams";

const RISK_LEVEL_OPTIONS: readonly RiskLevel[] = ["low", "medium", "high"];
const STATUS_OPTIONS: readonly AssessmentStatus[] = [
  "new",
  "in_review",
  "requires_follow_up",
  "cleared",
  "not_cleared",
];
const DASHBOARD_ORDERING_OPTIONS: readonly DashboardOrdering[] = [
  "-submitted_at",
  "submitted_at",
  "risk_level",
  "status",
];

export function isRiskLevel(value: string): value is RiskLevel {
  return RISK_LEVEL_OPTIONS.includes(value as RiskLevel);
}

export function isAssessmentStatus(value: string): value is AssessmentStatus {
  return STATUS_OPTIONS.includes(value as AssessmentStatus);
}

export function isDashboardOrdering(value: string): value is DashboardOrdering {
  return DASHBOARD_ORDERING_OPTIONS.includes(value as DashboardOrdering);
}

export function toQueryString(query: searchParams = {}): string {
  const params = new URLSearchParams();

  if (query.risk_level) params.set("risk_level", query.risk_level);
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.ordering) params.set("ordering", query.ordering);
  if (query.role) params.set("role", query.role);

  return params.toString();
}

