import { prisma } from "@db";

import { validateCreateJobAlertInput } from "./job-alert.validators";
import type { CreateJobAlertInput, JobAlertWithResults } from "./job-alert.types";

export async function listJobAlerts(userId: string): Promise<JobAlertWithResults[]> {
  return prisma.jobAlert.findMany({
    where: { userId },
    include: { results: { orderBy: { foundAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createJobAlert(
  userId: string,
  rawInput: unknown,
): Promise<JobAlertWithResults> {
  const input: CreateJobAlertInput = validateCreateJobAlertInput(rawInput);

  return prisma.jobAlert.create({
    data: {
      userId,
      site: input.site,
      keywords: input.keywords,
      location: input.location,
    },
    include: { results: true },
  });
}

export async function deleteJobAlert(userId: string, alertId: string): Promise<void> {
  const alert = await prisma.jobAlert.findFirstOrThrow({
    where: { id: alertId, userId },
  });
  await prisma.jobAlert.delete({ where: { id: alert.id } });
}

export async function checkJobAlert(
  userId: string,
  alertId: string,
): Promise<{ newCount: number }> {
  const alert = await prisma.jobAlert.findFirstOrThrow({
    where: { id: alertId, userId },
  });

  const serperKey = process.env.SERPER_API_KEY;

  if (!serperKey) {
    throw new Error("SERPER_API_KEY is not configured");
  }

  const parts = [
    `site:${alert.site}`,
    ...alert.keywords.map((k) => `"${k}"`),
    ...(alert.location ? [`"${alert.location}"`] : []),
  ];
  const query = parts.join(" ");

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": serperKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(`Serper API error: ${body.message ?? res.statusText}`);
  }

  const data = (await res.json()) as {
    organic?: Array<{ title: string; link: string; snippet?: string }>;
  };
  const items = data.organic ?? [];

  const created = await prisma.jobAlertResult.createMany({
    data: items.map((item) => ({
      alertId: alert.id,
      title: item.title,
      url: item.link,
      snippet: item.snippet ?? null,
    })),
    skipDuplicates: true,
  });

  await prisma.jobAlert.update({
    where: { id: alert.id },
    data: { lastCheckedAt: new Date() },
  });

  return { newCount: created.count };
}

export async function markAlertResultsSeen(userId: string, alertId: string): Promise<void> {
  await prisma.jobAlert.findFirstOrThrow({ where: { id: alertId, userId } });

  await prisma.jobAlertResult.updateMany({
    where: { alertId, seenAt: null },
    data: { seenAt: new Date() },
  });
}
