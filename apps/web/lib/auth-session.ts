import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getRequiredSession() {
  const session = await getSession();

  if (!session) {
    throw new UnauthorizedError();
  }

  return session;
}

export async function requireSession(redirectTo = "/login") {
  const session = await getSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

export async function redirectIfAuthenticated(redirectTo = "/") {
  const session = await getSession();

  if (session) {
    redirect(redirectTo);
  }
}
