import { NextResponse } from "next/server";
import { markAlertResultsSeen } from "@core/modules/job-alerts";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    await markAlertResultsSeen(session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to mark results seen";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
