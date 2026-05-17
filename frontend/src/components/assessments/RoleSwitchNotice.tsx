"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { UserRole } from "@/types/assessment";

export function RoleSwitchNotice({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateRole(nextRole: UserRole) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", nextRole);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      <div>
        Current simulated role:{" "}
        <span className="font-semibold text-slate-900">{role}</span>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:border-slate-900 disabled:bg-slate-900 disabled:text-white"
          disabled={role === "clinician"}
          onClick={() => updateRole("clinician")}
          type="button"
        >
          Clinician view
        </button>
        <button
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 disabled:border-slate-900 disabled:bg-slate-900 disabled:text-white"
          disabled={role === "admin"}
          onClick={() => updateRole("admin")}
          type="button"
        >
          Admin view
        </button>
      </div>
    </div>
  );
}
