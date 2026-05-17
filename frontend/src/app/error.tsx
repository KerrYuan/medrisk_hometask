"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <p className="font-semibold">Dashboard failed to load.</p>
        <p className="mt-2 text-sm">Check API service and try again.</p>
        <button
          className="mt-4 rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => reset()}
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
