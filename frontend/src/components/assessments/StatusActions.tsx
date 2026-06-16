"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiError } from "@/lib/apiError";
import { updateAssessmentStatus } from "@/lib/api";
import { getAllowedNextStatuses, STATUS_LABELS } from "@/lib/statusRules";
import type { AssessmentDetail, UserRole } from "@/types/assessment";

export function StatusActions({
  assessment,
  role,
}: {
  assessment: AssessmentDetail;
  role: UserRole;
}) {
  const router = useRouter();
  const allowed = getAllowedNextStatuses(assessment.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isClinician = role === "clinician";

  async function onUpdateStatus(nextStatus: (typeof allowed)[number]) {
    if (!isClinician || isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await updateAssessmentStatus({
        id: assessment.id,
        status: nextStatus,
        role,
        actor: assessment.clinician,
      });
      router.refresh();
    } catch (error) {
      setErrorMessage(parseApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Status actions</h2>
      <p className="mt-2 text-sm text-slate-600">
        {isClinician
          ? "Move this assessment through valid workflow states."
          : "Only clinician role can update review status."}
      </p>
      {errorMessage ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {allowed.length === 0 ? (
          <p className="text-sm text-slate-500">No available transitions from current status.</p>
        ) : (
          allowed.map((nextStatus) => (
            <button
              key={nextStatus}
              disabled={!isClinician || isSubmitting}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              type="button"
              onClick={() => onUpdateStatus(nextStatus)}
            >
              {isSubmitting ? "Updating..." : `Move to ${STATUS_LABELS[nextStatus]}`}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
