"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import {
  buildTraditionalPlan,
  groupChronologicalPlanDays,
  type ChronologicalSourceDay,
} from "@/features/plans/custom-plan";
import { db } from "@/lib/db/knex";

export async function activatePlanAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para ativar um plano.");

  const planTemplateId = Number(formData.get("planTemplateId"));
  const startDate = String(formData.get("startDate") ?? "").trim();

  if (!planTemplateId || !startDate) {
    redirect("/planos?error=Selecione um plano e a data de início.");
  }

  await db.transaction(async (trx) => {
    await trx("user_plans").where({ user_id: user.id }).update({ status: "paused" });
    await trx("user_plans").insert({
      user_id: user.id,
      plan_template_id: planTemplateId,
      start_date: startDate,
      current_day: 1,
      status: "active",
    });
  });

  revalidatePath("/hoje");
  revalidatePath("/planos");
  redirect("/hoje");
}

function buildCustomPlanName(planType: string, durationDays: number, customName: string): string {
  if (customName.length > 0) {
    return customName;
  }

  return `Plano ${planType === "chronological" ? "cronologico" : "tradicional"} ${durationDays} dias`;
}

export async function createCustomPlanAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para criar um plano personalizado.");
  const planType = String(formData.get("planType") ?? "").trim();
  const durationDays = Number(formData.get("durationDays"));
  const customName = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim() || new Date().toISOString().slice(0, 10);

  if (!["traditional", "chronological"].includes(planType) || ![90, 180, 365].includes(durationDays)) {
    redirect("/planos/novo?error=Escolha um modelo valido para o plano personalizado.");
  }

  let generatedRows:
    | {
        dayNumber: number;
        sortOrder: number;
        bookId: number;
        startChapter: number;
        endChapter: number;
        referenceLabel: string;
      }[]
    | null = null;

  if (planType === "traditional") {
    const chapterCounts = await db("chapters as c")
      .join("books as b", "b.id", "c.book_id")
      .select("b.id", "b.name")
      .count<{ id: number; name: string; total: string }[]>("c.id as total")
      .groupBy("b.id", "b.name")
      .orderBy("b.canonical_order", "asc");

    generatedRows = buildTraditionalPlan(
      chapterCounts.map((book) => ({
        bookId: Number(book.id),
        bookName: String(book.name),
        chapters: Number(book.total),
      })),
      durationDays,
    );
  } else {
    const sourceTemplate = await db("plan_templates")
      .select("id")
      .where({ slug: "chronological-365" })
      .first<{ id: number }>();

    if (!sourceTemplate) {
      redirect("/planos/novo?error=O plano cronologico base nao foi encontrado.");
    }

    const sourceRows = await db("plan_days as pd")
      .join("books as b", "b.id", "pd.book_id")
      .select(
        "pd.day_number",
        "pd.sort_order",
        "pd.book_id",
        "b.name as book_name",
        "pd.start_chapter",
        "pd.end_chapter",
        "pd.reference_label",
      )
      .where("pd.plan_template_id", sourceTemplate.id)
      .orderBy([
        { column: "pd.day_number", order: "asc" },
        { column: "pd.sort_order", order: "asc" },
      ]);

    const groupedSourceDays = sourceRows.reduce<ChronologicalSourceDay[]>((accumulator, row) => {
      const currentDayNumber = Number(row.day_number);
      const day = accumulator.at(-1);

      const segment = {
        bookId: Number(row.book_id),
        bookName: String(row.book_name),
        startChapter: Number(row.start_chapter),
        endChapter: Number(row.end_chapter ?? row.start_chapter),
        referenceLabel: String(row.reference_label),
        sortOrder: Number(row.sort_order),
      };

      if (day?.dayNumber === currentDayNumber) {
        day.segments.push(segment);
        return accumulator;
      }

      accumulator.push({
        dayNumber: currentDayNumber,
        segments: [segment],
      });
      return accumulator;
    }, []);

    generatedRows = groupChronologicalPlanDays(groupedSourceDays, durationDays);
  }

  const name = buildCustomPlanName(planType, durationDays, customName);
  const slug = `custom-${planType}-${durationDays}-${Date.now().toString(36)}`;

  await db.transaction(async (trx) => {
    const [template] = await trx("plan_templates")
      .insert({
        slug,
        name,
        description: `Plano personalizado ${planType === "chronological" ? "cronologico" : "tradicional"} com conclusão em ${durationDays} dias.`,
        duration_days: durationDays,
        plan_type: planType,
        created_by_user: user.id,
        is_public: false,
        is_custom: true,
      })
      .returning<{ id: number }[]>("id");

    if (!template) {
      throw new Error("Falha ao criar o plano personalizado");
    }

    await trx("plan_days").insert(
      generatedRows.map((row) => ({
        plan_template_id: template.id,
        day_number: row.dayNumber,
        sort_order: row.sortOrder,
        book_id: row.bookId,
        start_chapter: row.startChapter,
        end_chapter: row.endChapter,
        reference_label: row.referenceLabel,
      })),
    );

    await trx("user_plans").where({ user_id: user.id }).update({ status: "paused" });
    await trx("user_plans").insert({
      user_id: user.id,
      plan_template_id: template.id,
      start_date: startDate,
      current_day: 1,
      status: "active",
    });
  });

  revalidatePath("/planos");
  revalidatePath("/hoje");
  redirect("/hoje");
}
