import type { AssessmentStatus, RiskLevel } from "@/types/assessment";
import { RISK_LABELS, STATUS_LABELS } from "@/lib/statusRules";

const riskClassName: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusClassName: Record<AssessmentStatus, string> = {
  new: "bg-slate-100 text-slate-700 ring-slate-200",
  in_review: "bg-blue-50 text-blue-700 ring-blue-200",
  requires_follow_up: "bg-orange-50 text-orange-700 ring-orange-200",
  cleared: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  not_cleared: "bg-red-50 text-red-700 ring-red-200",
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ${riskClassName[risk]}`}>{RISK_LABELS[risk]}</span>;
}

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ${statusClassName[status]}`}>{STATUS_LABELS[status]}</span>;
}
