import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@core/modules/items";
import { getRequiredSession, UnauthorizedError } from "@/lib/auth-session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getRequiredSession();
    const { id } = await context.params;
    const body = await req.json();
    const item = await updateItem(session.user.id, id, body);
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to update item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await getRequiredSession();
    const { id } = await context.params;
    await deleteItem(session.user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Failed to delete item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
