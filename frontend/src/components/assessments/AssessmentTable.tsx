import Link from "next/link";
import type { Assessment } from "@/types/assessment";
import { RiskBadge, StatusBadge } from "./Badge";

function formatDate(value: string) {
  return value.slice(0, 10);
}

export function AssessmentTable({
  assessments,
  role,
}: {
  assessments: Assessment[];
  role: "clinician" | "admin";
}) {
  if (assessments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        No assessments match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Employer / role</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Clinician</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">
                  {assessment.candidate_name}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-800">
                    {assessment.employer_name}
                  </div>
                  <div className="text-slate-500">{assessment.role_title}</div>
                </td>
                <td className="px-4 py-4">
                  <RiskBadge risk={assessment.risk_level} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={assessment.status} />
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {assessment.clinician || "Unassigned"}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {assessment.flag_count}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {formatDate(assessment.submitted_at)}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-medium text-slate-900 underline underline-offset-4"
                    href={`/assessments/${assessment.id}?role=${role}`}
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
