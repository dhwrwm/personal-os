import { NextResponse } from "next/server";
import { importJobDetails } from "@core/modules/jobs";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function POST(req: Request) {
  try {
    await getRequiredSession();
    const body = (await req.json()) as { sourceText?: string };
    const details = await importJobDetails(body.sourceText ?? "");
    return NextResponse.json(details);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to import job details";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
