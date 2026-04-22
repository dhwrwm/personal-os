import { NextResponse } from "next/server";
import { importJobDetails } from "@core/modules/jobs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { sourceText?: string };
    const details = await importJobDetails(body.sourceText ?? "");
    return NextResponse.json(details);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import job details";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
