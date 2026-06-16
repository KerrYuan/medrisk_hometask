import type {
  Assessment,
  AssessmentDetail,
  AssessmentStatus,
  PaginatedResponse,
  UserRole,
  ReviewNote,
} from "@/types/assessment";
import { toQueryString } from "@/lib/queryParams";
import {searchParams} from "@/types/queryParams";

const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const INTERNAL_API_BASE_URL = process.env.NEXT_INTERNAL_API_BASE_URL;

function getBaseUrlCandidates() {
  if (typeof window !== "undefined") {
    return [CLIENT_API_BASE_URL];
  }

  const candidates = [
    INTERNAL_API_BASE_URL,
    CLIENT_API_BASE_URL,
    "http://api:8000/api",
    "http://localhost:8000/api",
  ].filter((value): value is string => Boolean(value));

  return [...new Set(candidates)];
}

type FetchOptions = RequestInit & { next?: { revalidate?: number } };

async function request<T>(path: string, options?: FetchOptions): Promise<T> {
  let response: Response | null = null;
  let lastNetworkError: unknown = null;

  for (const baseUrl of getBaseUrlCandidates()) {
    try {
      response = await fetch(`${baseUrl}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers ?? {}),
        },
        ...options,
      });
      break;
    } catch (error) {
      lastNetworkError = error;
    }
  }

  if (!response) {
    if (lastNetworkError instanceof Error) {
      throw lastNetworkError;
    }
    throw new Error("fetch failed");
  }

  if (!response.ok) {
    let detail = `Request failed with ${response.status}`;
    try {
      const body = await response.json();
      detail = typeof body === "string" ? body : JSON.stringify(body);
    } catch {
      // Keep default error text.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export async function getAssessments(query: searchParams = {}): Promise<PaginatedResponse<Assessment>> {
  const queryString = toQueryString(query);
  const path = `/assessments/${queryString ? `?${queryString}` : ""}`;
  return request<PaginatedResponse<Assessment>>(path, { cache: "no-store" });
}

export async function getAssessment(id: string): Promise<AssessmentDetail> {
  return request<AssessmentDetail>(`/assessments/${id}/`, { cache: "no-store" });
}

export async function updateAssessmentStatus(args: {
  id: number;
  status: AssessmentStatus;
  role: UserRole;
  actor: string;
}): Promise<AssessmentDetail> {
  return request<AssessmentDetail>(`/assessments/${args.id}/status/`, {
    method: "POST",
    body: JSON.stringify({ status: args.status, role: args.role, actor: args.actor }),
  });
}

export async function addReviewNote(args: {
  id: number;
  content: string;
  role: UserRole;
  author: string;
}): Promise<ReviewNote> {
  return request<ReviewNote>(`/assessments/${args.id}/notes/`, {
    method: "POST",
    body: JSON.stringify({ content: args.content, role: args.role, author: args.author }),
  });
}
