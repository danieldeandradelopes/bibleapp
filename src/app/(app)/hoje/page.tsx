import Link from "next/link";
import { auth } from "@/auth";
import { dismissOnboardingAction } from "@/features/account/actions";
import { getStoredUserPreferences } from "@/features/account/preferences";
import { getReminderSummary } from "@/features/account/queries";
import { canShareReadyMessage } from "@/features/auth/permissions";
import { markSharedToGroupAction } from "@/features/groups/actions";
import { getGroups } from "@/features/groups/queries";
import { setPreferredTranslationAction, toggleChapterProgressAction } from "@/features/reading/actions";
import { getBooks } from "@/features/reading/queries";
import { TranslationPicker } from "@/features/reading/translation-picker";
import { resolvePreferredTranslation } from "@/features/reading/translations";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { getTodayExperience } from "@/features/plans/queries";
import { DailyMessageCard } from "@/features/share/daily-message-card";
import { InstallAppCard } from "@/features/share/install-app-card";
import { db } from "@/lib/db/knex";
import { translateUserRole } from "@/lib/labels";

export const dynamic = "force-dynamic";

async function getVerseOfTheDay(chapterIds: number[], translationId?: number) {
  if (chapterIds.length === 0) return null;

  return db("verses as v")
    .leftJoin("verse_texts as vt", function joinText() {
      this.on("vt.verse_id", "=", "v.id");
      if (translationId) {
        this.andOn("vt.translation_id", "=", db.raw("?", [translationId]));
      }
    })
    .select("v.verse_number", "vt.text")
    .where("v.chapter_id", chapterIds[0])
    .orderBy("v.verse_number", "asc")
    .first<{ verse_number: number; text: string | null }>();
}

export default async function TodayPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const canShare = canShareReadyMessage(session?.user?.role);
  const [today, groups, books, translationState, reminderSummary, preferences] = await Promise.all([
    getTodayExperience(userId),
    getGroups(userId),
    getBooks(userId),
    resolvePreferredTranslation(userId),
    getReminderSummary(userId),
    getStoredUserPreferences(userId),
  ]);

  if (!today) {
    return (
      <main className="page-container">
        <div className="card">Não foi possível carregar a leitura do dia.</div>
      </main>
    );
  }

  const verseOfTheDay = await getVerseOfTheDay(today.readings[0]?.chapterIds ?? [], translationState.current?.id);
  const completedChapters = books.reduce((sum, book) => sum + book.completedChapters, 0);
  const totalChapters = books.reduce((sum, book) => sum + book.totalChapters, 0);
  const progressPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const sharedToday = userId
    ? await db("group_share_logs as gsl")
        .join("daily_messages as dm", "dm.id", "gsl.daily_message_id")
        .select("gsl.group_id")
        .where("gsl.user_id", userId)
        .andWhere("dm.date", new Date().toISOString().slice(0, 10))
    : [];
  const sharedGroupIds = new Set(sharedToday.map((row) => Number(row.group_id)));

  return (
    <main className="page-container grid-gap">
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p className="muted" style={{ margin: 0 }}>
              Hoje
            </p>
            <h1 className="section-title" style={{ marginBottom: "0.25rem" }}>
              {session?.user?.name ? `A paz de Deus, ${session.user.name}` : "A paz de Deus"}
            </h1>
            <p className="section-subtitle">
              {today.template.name} • Dia {today.dayNumber}
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.75rem", justifyItems: "end" }}>
            <span className="chip chip-accent">{translateUserRole(session?.user?.role ?? "guest")}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <InstallAppCard compact />

      {session?.user?.id && !preferences.onboardingCompleted && (
        <section className="card-muted" style={{ display: "grid", gap: "0.75rem" }}>
          <strong>Primeiros passos da Fase 2</strong>
          <p className="muted" style={{ margin: 0 }}>
            Agora voce pode alternar versoes, salvar destaques, criar planos personalizados e preparar lembretes.
          </p>
          <form action={dismissOnboardingAction}>
            <button className="button-secondary" type="submit">
              Entendi
            </button>
          </form>
        </section>
      )}

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between" }}>
          <span className="chip">Versículo do dia</span>
          <TranslationPicker
            action={setPreferredTranslationAction}
            currentCode={translationState.current?.code ?? ""}
            redirectPath="/hoje"
            translations={translationState.translations}
          />
        </div>
        <h2 style={{ margin: 0 }}>{today.referenceLabel}</h2>
        <p className="reading-text" style={{ margin: 0 }}>
          <strong>{verseOfTheDay?.verse_number ?? 1}.</strong>{" "}
          {verseOfTheDay?.text ?? "Selecione um capítulo para ver o texto da tradução configurada."}
        </p>
      </section>

      <DailyMessageCard canShare={canShare} defaultMessage={today.messageText} referenceLabel={today.referenceLabel}>
        {canShare && groups.length > 0 && (
          <div className="grid-gap">
            <div className="divider" />
            <strong>Marcar grupos enviados hoje</strong>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {groups.map((group) => (
                <form key={group.id} action={markSharedToGroupAction}>
                  <input type="hidden" name="groupId" value={group.id} />
                  <button
                    className={sharedGroupIds.has(Number(group.id)) ? "button-secondary" : "button-primary"}
                    type="submit"
                  >
                    {sharedGroupIds.has(Number(group.id)) ? `Enviado: ${group.name}` : `Marcar ${group.name}`}
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}
      </DailyMessageCard>

      <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="card">
          <strong>Progresso geral</strong>
          <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{progressPercent}%</p>
          <p className="muted" style={{ margin: 0 }}>
            {completedChapters} de {totalChapters} capítulos concluídos.
          </p>
        </div>
        <div className="card">
          <strong>Capítulos de hoje</strong>
          <p className="muted" style={{ margin: "0.5rem 0 0" }}>
            {today.readings.map((reading) => reading.referenceLabel).join(" • ")}
          </p>
        </div>
        <div className="card">
          <strong>Biblioteca pessoal</strong>
          <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>
            Salve versiculos destacados e favoritos para revisitar depois.
          </p>
          <Link className="button-secondary" href="/salvos">
            Abrir salvos
          </Link>
        </div>
      </section>

      {reminderSummary && (
        <section className="card" style={{ display: "grid", gap: "0.5rem" }}>
          <strong>Lembrete de leitura</strong>
          <p className="muted" style={{ margin: 0 }}>
            {reminderSummary.enabled
              ? `Ativo para ${reminderSummary.reminderTime} (${reminderSummary.reminderTimezone}).`
              : "Ainda desativado. Ative na conta para criar seu ritmo diario."}
          </p>
          <p className="muted" style={{ margin: 0 }}>
            {reminderSummary.statusLabel}
          </p>
        </section>
      )}

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Leitura do dia</h2>
        {today.readings.map((reading) => (
          <div key={`${reading.bookSlug}-${reading.startChapter}`} className="card-muted">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
              <div>
                <strong>{reading.referenceLabel}</strong>
                <p className="muted" style={{ margin: "0.25rem 0 0" }}>
                  {reading.bookName}
                </p>
              </div>
              <Link
                className="button-secondary"
                href={`/biblia/${reading.bookSlug}/${reading.startChapter}`}
              >
                Abrir capítulo
              </Link>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
              {reading.chapterIds.map((chapterId, index) => {
                const chapterNumber = reading.startChapter + index;
                return (
                  <form key={chapterId} action={toggleChapterProgressAction}>
                    <input type="hidden" name="chapterId" value={chapterId} />
                    <input type="hidden" name="bookId" value={reading.bookId} />
                    <input type="hidden" name="redirectPath" value="/hoje" />
                    <button className="button-secondary" type="submit">
                      Marcar {reading.bookName} {chapterNumber}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
