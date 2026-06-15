import { DashboardFilters } from "@/components/assessments/DashboardFilters";
import { AssessmentTable } from "@/components/assessments/AssessmentTable";
import { RoleSwitchNotice } from "@/components/assessments/RoleSwitchNotice";
import { getAssessments } from "@/lib/api";
import type { searchParams } from "@/types/queryParams";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<searchParams>;
}) {
  const params = await searchParams;
  const role = params.role === "admin" ? "admin" : "clinician";
  const assessments = await getAssessments({
    risk_level: params.risk_level,
    status: params.status,
    search: params.search,
    ordering: params.ordering,
  });

  const total = assessments.length;
  const highRisk = assessments.filter(
    (item) => item.risk_level === "high",
  ).length;
  const requiresFollowUp = assessments.filter(
    (item) => item.status === "requires_follow_up",
  ).length;
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8">
      <header className="grid gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Medrisk home task
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Assessment Review Dashboard
        </h1>
        <p className="max-w-3xl text-slate-600">
          Starter implementation. Improve the workflow, filtering, role-aware
          controls, validation, and UI quality.
        </p>
      </header>

      <RoleSwitchNotice role={role} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Visible assessments</div>
          <div className="mt-2 text-3xl font-bold text-slate-950">{total}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">High risk</div>
          <div className="mt-2 text-3xl font-bold text-slate-950">
            {highRisk}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Requires follow-up</div>
          <div className="mt-2 text-3xl font-bold text-slate-950">
            {requiresFollowUp}
          </div>
        </div>
      </section>

      <DashboardFilters />
      <AssessmentTable assessments={assessments} role={role} />
    </main>
  );
}
