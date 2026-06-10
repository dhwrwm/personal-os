import { NextResponse } from "next/server";
import { checkJobAlert } from "@core/modules/job-alerts";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getRequiredSession();
    const { id } = await params;
    const result = await checkJobAlert(session.user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to check job alert";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
