import { NextResponse } from "next/server";
import { createJobAlert, listJobAlerts } from "@core/modules/job-alerts";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function GET() {
  try {
    const session = await getRequiredSession();
    const alerts = await listJobAlerts(session.user.id);
    return NextResponse.json(alerts);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to load job alerts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getRequiredSession();
    const body = await req.json();
    const alert = await createJobAlert(session.user.id, body);
    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create job alert";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
