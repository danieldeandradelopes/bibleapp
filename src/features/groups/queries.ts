import "server-only";

import { db } from "@/lib/db/knex";

export async function getGroups(userId?: string | null) {
  if (!userId) return [];

  return db("groups")
    .select("id", "name", "sort_order", "is_favorite")
    .where({ user_id: userId })
    .orderBy([{ column: "sort_order", order: "asc" }, { column: "name", order: "asc" }]);
}

export async function getGroupProgress(userId?: string | null) {
  if (!userId) {
    return {
      totalGroups: 0,
      totalShares: 0,
      sharesByGroup: [],
    };
  }

  const sharesByGroup = await db("groups as g")
    .leftJoin("group_share_logs as gsl", "g.id", "gsl.group_id")
    .select("g.id", "g.name")
    .count<{ id: number; name: string; total: string }[]>("gsl.id as total")
    .where("g.user_id", userId)
    .groupBy("g.id", "g.name")
    .orderBy("g.name", "asc");

  const totalShares = sharesByGroup.reduce((sum, item) => sum + Number(item.total), 0);

  return {
    totalGroups: sharesByGroup.length,
    totalShares,
    sharesByGroup: sharesByGroup.map((item) => ({
      id: Number(item.id),
      name: String(item.name),
      total: Number(item.total),
    })),
  };
}
