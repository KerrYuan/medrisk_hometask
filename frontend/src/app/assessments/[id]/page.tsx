import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditTrail } from "@/components/assessments/AuditTrail";
import { RiskBadge, StatusBadge } from "@/components/assessments/Badge";
import { ReviewNotes } from "@/components/assessments/ReviewNotes";
import { RoleSwitchNotice } from "@/components/assessments/RoleSwitchNotice";
import { StatusActions } from "@/components/assessments/StatusActions";
import { getAssessment } from "@/lib/api";
import type { UserRole } from "@/types/assessment";

function formatDateTime(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

export default async function AssessmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: UserRole }>;
}) {
  const { id } = await params;
  const detailSearchParams = await searchParams;
  const role = detailSearchParams.role === "admin" ? "admin" : "clinician";
  let assessment;

  try {
    assessment = await getAssessment(id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8">
      <div>
        <Link
          className="text-sm font-medium text-slate-600 underline underline-offset-4"
          href={`/?role=${role}`}
        >
          ← Back to dashboard
        </Link>
      </div>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Assessment review
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {assessment.candidate_name}
            </h1>
            <p className="mt-2 text-slate-600">
              {assessment.employer_name} · {assessment.role_title}
            </p>
          </div>
          <div className="flex gap-2">
            <RiskBadge risk={assessment.risk_level} />
            <StatusBadge status={assessment.status} />
          </div>
        </div>
      </header>

      <RoleSwitchNotice role={role} />

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Assessment summary
            </h2>
            <p className="mt-3 text-slate-700">{assessment.summary}</p>
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Risk flags
              </h3>
              {assessment.flags.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">
                  No flags recorded.
                </p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {assessment.flags.map((flag) => (
                    <li
                      key={flag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {flag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <ReviewNotes assessment={assessment} role={role} />
          <AuditTrail assessment={assessment} />
        </div>

        <aside className="grid content-start gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Case details
            </h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Submitted</dt>
                <dd className="font-medium text-slate-900">
                  {formatDateTime(assessment.submitted_at)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Assigned clinician</dt>
                <dd className="font-medium text-slate-900">
                  {assessment.clinician || "Unassigned"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Assessment ID</dt>
                <dd className="font-mono text-slate-700">#{assessment.id}</dd>
              </div>
            </dl>
          </section>
          <StatusActions assessment={assessment} role={role} />
        </aside>
      </section>
    </main>
  );
}
