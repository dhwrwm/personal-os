import type { CreateJobAlertInput } from "./job-alert.types";

export function validateCreateJobAlertInput(raw: unknown): CreateJobAlertInput {
  if (!raw || typeof raw !== "object") throw new Error("Invalid input");
  const input = raw as Record<string, unknown>;

  if (typeof input.site !== "string" || !input.site.trim()) {
    throw new Error("site is required");
  }
  if (!Array.isArray(input.keywords) || input.keywords.length === 0) {
    throw new Error("at least one keyword is required");
  }
  if (!input.keywords.every((k) => typeof k === "string" && k.trim())) {
    throw new Error("all keywords must be non-empty strings");
  }

  return {
    site: input.site.trim(),
    keywords: (input.keywords as string[]).map((k) => k.trim()),
    location:
      typeof input.location === "string" && input.location.trim()
        ? input.location.trim()
        : undefined,
  };
}
