import type { AssessmentStatus } from "@/types/assessment";

export const STATUS_LABELS: Record<AssessmentStatus, string> = {
  new: "New",
  in_review: "In review",
  requires_follow_up: "Requires follow-up",
  cleared: "Cleared",
  not_cleared: "Not cleared",
};

export const RISK_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export const ALLOWED_STATUS_TRANSITIONS: Record<AssessmentStatus, AssessmentStatus[]> = {
  new: ["in_review"],
  in_review: ["requires_follow_up", "cleared", "not_cleared"],
  requires_follow_up: ["in_review"],
  cleared: [],
  not_cleared: [],
};

export function getAllowedNextStatuses(status: AssessmentStatus): AssessmentStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[status] ?? [];
}
