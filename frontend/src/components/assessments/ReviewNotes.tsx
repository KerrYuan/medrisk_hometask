"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { addReviewNote } from "@/lib/api";
import { parseApiError } from "@/lib/apiError";
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
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isClinician = role === "clinician";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isClinician || isSubmitting) {
      return;
    }

    const trimmed = content.trim();

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await addReviewNote({
        id: assessment.id,
        content: trimmed,
        role,
        author: "Dr Example",
      });
      setContent("");
      router.refresh();
    } catch (error) {
      setErrorMessage(parseApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Review notes</h2>
      <p className="mt-2 text-sm text-slate-600">
        {isClinician
          ? "Add clinician notes to keep a clear review history."
          : "Only clinician role can add review notes."}
      </p>
      {errorMessage ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <textarea
          className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none"
          placeholder="Add clinical review note..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={!isClinician || isSubmitting}
        />
        <button
          className="w-fit rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!isClinician || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Add note"}
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
