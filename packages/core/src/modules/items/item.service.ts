import { prisma } from "@db";
import type { Prisma } from "@prisma/client";

import { validateCreateItemInput, validateUpdateItemInput } from "./item.validators";
import type { CreateItemInput, ItemListRecord, UpdateItemInput } from "./item.types";

const DEMO_USER_EMAIL = "test@example.com";

async function getOrCreateDefaultUser() {
  return prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { email: DEMO_USER_EMAIL },
  });
}

async function getUserItemOrThrow(itemId: string) {
  const user = await getOrCreateDefaultUser();

  return prisma.item.findFirstOrThrow({
    where: {
      id: itemId,
      userId: user.id,
    },
    include: {
      job: true,
      transaction: true,
      note: true,
      todo: true,
      bookmark: true,
    },
  });
}

export async function listItems(): Promise<ItemListRecord[]> {
  const user = await getOrCreateDefaultUser();

  return prisma.item.findMany({
    where: { userId: user.id },
    include: {
      job: true,
      transaction: true,
      note: true,
      todo: true,
      bookmark: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createItem(rawInput: unknown): Promise<ItemListRecord> {
  const user = await getOrCreateDefaultUser();
  const input: CreateItemInput = validateCreateItemInput(rawInput);

  const item = await prisma.item.create({
    data: {
      type: input.type,
      title: input.title,
      content: input.content,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      tags: input.tags ?? [],
      userId: user.id,
      ...(input.job
        ? {
            job: {
              create: {
                company: input.job.company,
                role: input.job.role,
                status: input.job.status,
                source: input.job.source,
                link: input.job.link,
                appliedAt: input.job.appliedAt
                  ? new Date(input.job.appliedAt)
                  : undefined,
              },
            },
          }
        : {}),
      ...(input.transaction
        ? {
            transaction: {
              create: {
                amount: input.transaction.amount,
                category: input.transaction.category,
                date: new Date(input.transaction.date),
                type: input.transaction.type,
              },
            },
          }
        : {}),
      ...(input.note
        ? {
            note: {
              create: {
                content: input.note.content,
              },
            },
          }
        : {}),
      ...(input.todo
        ? {
            todo: {
              create: {
                completed: input.todo.completed ?? false,
                dueDate: input.todo.dueDate ? new Date(input.todo.dueDate) : null,
                priority: input.todo.priority ?? "medium",
              },
            },
          }
        : {}),
      ...(input.bookmark
        ? {
            bookmark: {
              create: {
                url: input.bookmark.url,
              },
            },
          }
        : {}),
    },
    include: {
      // Read-after-write keeps the response shape aligned with listItems.
      job: true,
      transaction: true,
      note: true,
      todo: true,
      bookmark: true,
    },
  });

  return prisma.item.findUniqueOrThrow({
    where: { id: item.id },
    include: {
      job: true,
      transaction: true,
      note: true,
      todo: true,
      bookmark: true,
    },
  });
}

export async function updateItem(
  itemId: string,
  rawInput: unknown,
): Promise<ItemListRecord> {
  const existingItem = await getUserItemOrThrow(itemId);
  const input: UpdateItemInput = validateUpdateItemInput(rawInput);

  const item = await prisma.item.update({
    where: { id: existingItem.id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.metadata !== undefined
        ? { metadata: input.metadata as Prisma.InputJsonValue }
        : {}),
      ...(input.job
        ? {
            job: {
              update: {
                ...(input.job.company !== undefined
                  ? { company: input.job.company }
                  : {}),
                ...(input.job.role !== undefined ? { role: input.job.role } : {}),
                ...(input.job.status !== undefined
                  ? { status: input.job.status }
                  : {}),
                ...(input.job.source !== undefined
                  ? { source: input.job.source }
                  : {}),
                ...(input.job.link !== undefined ? { link: input.job.link } : {}),
                ...(input.job.appliedAt !== undefined
                  ? {
                      appliedAt: input.job.appliedAt
                        ? new Date(input.job.appliedAt)
                        : null,
                    }
                  : {}),
              },
            },
          }
        : {}),
    },
    include: {
      job: true,
      transaction: true,
      note: true,
      todo: true,
      bookmark: true,
    },
  });

  return item;
}

export async function deleteItem(itemId: string): Promise<void> {
  const existingItem = await getUserItemOrThrow(itemId);

  await prisma.item.delete({
    where: { id: existingItem.id },
  });
}
