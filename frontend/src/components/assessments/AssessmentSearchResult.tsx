import { AssessmentTable } from "@/components/assessments/AssessmentTable";
import { getAssessments } from "@/lib/api";
import type { searchParams } from "@/types/queryParams";

const PAGE_SIZE = 25;

export async function AssessmentSearchResult({
  params,
  role,
}: {
  params: searchParams;
  role: "clinician" | "admin";
}) {
  const page = Math.max(1, Number(params.page) || 1);
  const { count, next, previous, results } = await getAssessments({
    risk_level: params.risk_level,
    status: params.status,
    search: params.search,
    ordering: params.ordering,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const highRisk = results.filter(
    (item) => item.risk_level === "high",
  ).length;
  const requiresFollowUp = results.filter(
    (item) => item.status === "requires_follow_up",
  ).length;

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Visible assessments</div>
          <div className="mt-2 text-3xl font-bold text-slate-950">{results.length} / {count}</div>
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

      <AssessmentTable
        assessments={results}
        role={role}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count}
        hasNext={Boolean(next)}
        hasPrevious={Boolean(previous)}
        params={params}
      />
    </>
  );
}