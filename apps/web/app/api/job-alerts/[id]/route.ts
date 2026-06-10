import { NextResponse } from "next/server";
import { deleteJobAlert } from "@core/modules/job-alerts";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    await deleteJobAlert(session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete job alert";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
