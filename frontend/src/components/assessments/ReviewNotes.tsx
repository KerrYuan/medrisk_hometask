"use client";

import type { AssessmentDetail, UserRole } from "@/types/assessment";

function formatDateTime(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

export function ReviewNotes({
  assessment,
  role,
}: {
  assessment: AssessmentDetail;
  role: UserRole;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Review notes</h2>
      <p className="mt-2 text-sm text-slate-600">
        Starter placeholder: adding notes is intentionally disabled.
      </p>
      <form className="mt-4 grid gap-3">
        <textarea
          className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none"
          placeholder="Add clinical review note..."
          disabled
        />
        <button
          className="w-fit rounded-xl bg-slate-300 px-4 py-2 text-sm font-medium text-white"
          disabled
          type="button"
        >
          Add note
        </button>
      </form>

      <div className="mt-5 grid gap-3">
        {assessment.notes.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            No review notes yet.
          </p>
        ) : (
          assessment.notes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {note.author}
                </span>
                <time>{formatDateTime(note.created_at)}</time>
              </div>
              <p className="mt-2 text-sm text-slate-700">{note.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
