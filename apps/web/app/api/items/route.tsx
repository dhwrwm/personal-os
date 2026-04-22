import { NextResponse } from "next/server";
import { createItem, listItems } from "@core/modules/items";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

export async function GET() {
  try {
    const session = await getRequiredSession();
    const items = await listItems(session.user.id);
    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to load items";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getRequiredSession();
    const body = await req.json();
    const item = await createItem(session.user.id, body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to create item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
