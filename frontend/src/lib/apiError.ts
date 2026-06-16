function normalizeErrorValue(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const joined = value.filter((item) => typeof item === "string").join(" ");
    return joined || null;
  }

  return null;
}

export function parseApiError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unexpected error. Please try again.";
  }

  const message = error.message || "";

  try {
    const parsed = JSON.parse(message) as Record<string, unknown>;
    const statusText = normalizeErrorValue(parsed.status);
    if (statusText) {
      return statusText;
    }

    const detailText = normalizeErrorValue(parsed.detail);
    if (detailText) {
      return detailText;
    }

    const firstValue = Object.values(parsed)[0];
    const firstText = normalizeErrorValue(firstValue);
    if (firstText) {
      return firstText;
    }
  } catch {
    // Keep original error message when response body is not JSON.
  }

  return message || "Unexpected error. Please try again.";
}

