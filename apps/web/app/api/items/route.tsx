import { prisma } from "../../../../../packages/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.item.findMany({
    include: {
      job: true,
      transaction: true,
      note: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();

  const item = await prisma.item.create({
    data: {
      type: body.type,
      title: body.title,
      content: body.content,
      metadata: body.metadata || {},
      tags: body.tags || [],
      //nested creates for related models
      ...(body.job && {
        job: {
          create: {
            company: body.job.company,
            position: body.job.position,
            status: body.job.status,
          },
        },
      }),
      ...(body.transaction && {
        transaction: {
          create: {
            amount: body.transaction.amount,
            date: new Date(body.transaction.date),
            category: body.transaction.category,
          },
        },
      }),
      ...(body.todo && {
        todo: {
          create: {
            completed: body.todo.completed,
            dueDate: body.todo.dueDate ? new Date(body.todo.dueDate) : null,
            priority: body.todo.priority,
          },
        },
      }),
      ...(body.bookmark && {
        bookmark: {
          create: {
            url: body.bookmark.url,
          },
        },
      }),
      ...(body.note && {
        note: {
          create: {
            content: body.note.content,
          },
        },
      }),
    },
  });

  return NextResponse.json(item);
}
