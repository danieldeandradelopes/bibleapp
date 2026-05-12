import "server-only";

import { cache } from "react";
import { formatDailyMessage, formatReferenceLabel } from "@/features/share/format-message";
import { db } from "@/lib/db/knex";

export type ReadingSegment = {
  bookId: number;
  bookSlug: string;
  bookName: string;
  chapterIds: number[];
  startChapter: number;
  endChapter: number;
  referenceLabel: string;
};

export type TodayExperience = {
  template: {
    id: number;
    slug: string;
    name: string;
    description: string;
    durationDays: number;
  };
  dayNumber: number;
  referenceLabel: string;
  messageText: string;
  readings: ReadingSegment[];
};

export type PlanTemplateSummary = {
  id: number;
  slug: string;
  name: string;
  description: string;
  duration_days: number;
  plan_type: string;
  is_public: boolean;
  is_custom: boolean;
  created_by_user: string | null;
};

type UserPlanRow = {
  id: number;
  user_id: string;
  plan_template_id: number;
  start_date: string;
  current_day: number;
  status: string;
};

function diffInDays(fromDate: Date, toDate: Date): number {
  const start = new Date(fromDate.toISOString().slice(0, 10));
  const end = new Date(toDate.toISOString().slice(0, 10));
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export async function getPlanTemplates(userId?: string | null) {
  const query = db("plan_templates")
    .select(
      "id",
      "slug",
      "name",
      "description",
      "duration_days",
      "plan_type",
      "is_public",
      "is_custom",
      "created_by_user",
    )
    .orderBy([
      { column: "is_custom", order: "asc" },
      { column: "plan_type", order: "asc" },
      { column: "name", order: "asc" },
    ]);

  if (!userId) {
    return query.where({ is_public: true }) as Promise<PlanTemplateSummary[]>;
  }

  return query
    .where((builder) =>
      builder.where({ is_public: true }).orWhere("created_by_user", userId),
    ) as Promise<PlanTemplateSummary[]>;
}

export async function getUserPlans(userId?: string | null) {
  if (!userId) return [];

  return db("user_plans as up")
    .join("plan_templates as pt", "pt.id", "up.plan_template_id")
    .select(
      "up.id",
      "up.start_date",
      "up.current_day",
      "up.status",
      "pt.slug",
      "pt.name",
      "pt.description",
      "pt.duration_days",
      "pt.plan_type",
      "pt.is_custom",
    )
    .where("up.user_id", userId)
    .orderBy("up.created_at", "desc");
}

async function getActivePlan(userId?: string | null): Promise<UserPlanRow | null> {
  if (!userId) return null;

  const activePlan = await db("user_plans")
    .select("id", "user_id", "plan_template_id", "start_date", "current_day", "status")
    .where({ user_id: userId, status: "active" })
    .orderBy("created_at", "desc")
    .first<UserPlanRow>();

  return activePlan ?? null;
}

async function getFallbackTemplate() {
  return db("plan_templates")
    .select("id", "slug", "name", "description", "duration_days")
    .where({ slug: "chronological-365" })
    .first<{
      id: number;
      slug: string;
      name: string;
      description: string;
      duration_days: number;
    }>();
}

const getTodayExperienceCached = cache(async function getTodayExperienceCached(
  userId: string | null | undefined,
  isoDate: string,
): Promise<TodayExperience | null> {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const userPlan = await getActivePlan(userId);

  const template =
    userPlan === null
      ? await getFallbackTemplate()
      : await db("plan_templates")
          .select("id", "slug", "name", "description", "duration_days")
          .where({ id: userPlan.plan_template_id })
          .first<{
            id: number;
            slug: string;
            name: string;
            description: string;
            duration_days: number;
          }>();

  if (!template) return null;

  const dayNumber =
    userPlan === null
      ? 1
      : Math.min(Math.max(diffInDays(new Date(userPlan.start_date), date) + 1, 1), template.duration_days);

  const rows = await db("plan_days as pd")
    .join("books as b", "b.id", "pd.book_id")
    .leftJoin("chapters as c", function joinChapterIds() {
      this.on("c.book_id", "=", "pd.book_id")
        .andOn("c.chapter_number", ">=", "pd.start_chapter")
        .andOn(
          "c.chapter_number",
          "<=",
          db.raw("COALESCE(pd.end_chapter, pd.start_chapter)"),
        );
    })
    .select(
      "pd.book_id",
      "b.slug as book_slug",
      "b.name as book_name",
      "pd.start_chapter",
      "pd.end_chapter",
      "pd.reference_label",
      "pd.sort_order",
      db.raw("array_remove(array_agg(c.id ORDER BY c.chapter_number), NULL) as chapter_ids"),
    )
    .where("pd.plan_template_id", template.id)
    .andWhere("pd.day_number", dayNumber)
    .groupBy(
      "pd.id",
      "pd.book_id",
      "b.slug",
      "b.name",
      "pd.start_chapter",
      "pd.end_chapter",
      "pd.reference_label",
      "pd.sort_order",
    )
    .orderBy("pd.sort_order", "asc");

  const readings: ReadingSegment[] = rows.map((row) => ({
    bookId: Number(row.book_id),
    bookSlug: String(row.book_slug),
    bookName: String(row.book_name),
    chapterIds: Array.isArray(row.chapter_ids) ? row.chapter_ids.map(Number) : [],
    startChapter: Number(row.start_chapter),
    endChapter: Number(row.end_chapter ?? row.start_chapter),
    referenceLabel: String(row.reference_label),
  }));

  if (readings.length === 0) return null;

  const referenceLabel = formatReferenceLabel(
    readings.map((reading) => ({
      bookName: reading.bookName,
      startChapter: reading.startChapter,
      endChapter: reading.endChapter,
    })),
  );

  return {
    template: {
      id: template.id,
      slug: template.slug,
      name: template.name,
      description: template.description,
      durationDays: template.duration_days,
    },
    dayNumber,
    referenceLabel,
    messageText: formatDailyMessage(
      date,
      readings.map((reading) => ({
        bookName: reading.bookName,
        startChapter: reading.startChapter,
        endChapter: reading.endChapter,
      })),
    ),
    readings,
  };
});

export async function getTodayExperience(
  userId?: string | null,
  date = new Date(),
): Promise<TodayExperience | null> {
  return getTodayExperienceCached(userId, date.toISOString().slice(0, 10));
}

export async function upsertDailyMessage(userId: string, experience: TodayExperience, date = new Date()) {
  const isoDate = date.toISOString().slice(0, 10);
  const existing = await db("daily_messages")
    .select("id")
    .where({
      user_id: userId,
      date: isoDate,
      plan_template_id: experience.template.id,
    })
    .first<{ id: number }>();

  if (existing) {
    await db("daily_messages")
      .where({ id: existing.id })
      .update({
        reference_label: experience.referenceLabel,
        message_text: experience.messageText,
      });
    return existing.id;
  }

  const [created] = await db("daily_messages")
    .insert({
      user_id: userId,
      date: isoDate,
      plan_template_id: experience.template.id,
      reference_label: experience.referenceLabel,
      message_text: experience.messageText,
    })
    .returning<{ id: number }[]>("id");

  if (!created) {
    throw new Error("Failed to create daily message");
  }

  return created.id;
}
