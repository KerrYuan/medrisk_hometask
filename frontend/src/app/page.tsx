import { Suspense } from "react";
import { AssessmentSearchResult } from "@/components/assessments/AssessmentSearchResult";
import { DashboardFilters } from "@/components/assessments/DashboardFilters";
import { RoleSwitchNotice } from "@/components/assessments/RoleSwitchNotice";
import Loading from "@/app/loading";
import type { searchParams } from "@/types/queryParams";


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<searchParams>;
}) {
  const params = await searchParams;
  const role = params.role === "admin" ? "admin" : "clinician";

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
      <DashboardFilters />

      <Suspense fallback={<Loading />}>
        <AssessmentSearchResult params={params} role={role} />
      </Suspense>
    </main>
  );
}
