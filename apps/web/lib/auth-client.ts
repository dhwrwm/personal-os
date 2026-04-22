"use client";

import { createAuthClient } from "better-auth/react";

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }

  return `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth`;
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
});
