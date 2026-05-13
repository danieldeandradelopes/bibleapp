import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { canShareReadyMessage } from "@/features/auth/permissions";
import { saveChapterNoteAction } from "@/features/notes/actions";
import { toggleChapterProgressAction, setPreferredTranslationAction } from "@/features/reading/actions";
import { ChapterContextCard } from "@/features/reading/chapter-context-card";
import { getChapterPageData } from "@/features/reading/queries";
import { TranslationPicker } from "@/features/reading/translation-picker";
import { VerseReadingClient } from "@/features/reading/verse-reading-client";

export const dynamic = "force-dynamic";

type ChapterPageProps = {
  params: Promise<{ bookSlug: string; chapterNumber: string }>;
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookSlug, chapterNumber } = await params;
  const chapterNumberValue = Number(chapterNumber);
  const session = await auth();
  const chapterData = await getChapterPageData(bookSlug, chapterNumberValue, session?.user?.id);

  if (!chapterData) {
    notFound();
  }

  const canShare = canShareReadyMessage(session?.user?.role);
  const redirectPath = `/biblia/${bookSlug}/${chapterNumberValue}`;

  return (
    <main className="page-container grid-gap">
      <header className="grid-gap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Link href={`/biblia/${bookSlug}`} className="muted">
              ← Voltar para {chapterData.book.name}
            </Link>
            <h1 className="section-title" style={{ marginBottom: "0.25rem" }}>
              {chapterData.book.name} {chapterData.chapter.chapterNumber}
            </h1>
            <p className="section-subtitle">
              Leitura confortável, contexto editorial, seleção de versículos e anotação por capítulo.
            </p>
          </div>
          <form action={toggleChapterProgressAction} style={{ display: "flex", flex: "1 1 12rem", justifyContent: "flex-end" }}>
            <input type="hidden" name="chapterId" value={chapterData.chapter.id} />
            <input type="hidden" name="bookId" value={chapterData.book.id} />
            <input type="hidden" name="redirectPath" value={redirectPath} />
            <button
              className={chapterData.chapter.completed ? "button-secondary" : "button-primary"}
              type="submit"
              style={{ width: "100%", maxWidth: "12rem" }}
            >
              {chapterData.chapter.completed ? "Desfazer leitura" : "Marcar leitura"}
            </button>
          </form>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {chapterData.chapter.previousChapterNumber && (
            <Link
              className="button-secondary"
              href={`/biblia/${bookSlug}/${chapterData.chapter.previousChapterNumber}`}
              style={{ flex: "1 1 11rem" }}
            >
              Capítulo anterior
            </Link>
          )}
          {chapterData.chapter.nextChapterNumber && (
            <Link
              className="button-secondary"
              href={`/biblia/${bookSlug}/${chapterData.chapter.nextChapterNumber}`}
              style={{ flex: "1 1 11rem" }}
            >
              Próximo capítulo
            </Link>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end" }}>
          {chapterData.currentTranslation && (
            <span className="chip chip-accent">{chapterData.currentTranslation.name}</span>
          )}
          <TranslationPicker
            action={setPreferredTranslationAction}
            currentCode={chapterData.currentTranslation?.code ?? ""}
            redirectPath={redirectPath}
            translations={chapterData.translations}
          />
        </div>
      </header>

      <ChapterContextCard context={chapterData.chapterContext} />

      <VerseReadingClient
        bookName={chapterData.book.name}
        chapterNumber={chapterData.chapter.chapterNumber}
        redirectPath={redirectPath}
        verses={chapterData.verses}
        canShare={canShare}
        isAuthenticated={Boolean(session?.user?.id)}
        highlightedVerseIds={chapterData.highlightedVerseIds}
        favoriteVerseIds={chapterData.favoriteVerseIds}
      />

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Anotações do capítulo</h2>
        <form action={saveChapterNoteAction} className="grid-gap">
          <input type="hidden" name="chapterId" value={chapterData.chapter.id} />
          <input type="hidden" name="bookId" value={chapterData.book.id} />
          <input type="hidden" name="redirectPath" value={redirectPath} />
          <textarea
            name="content"
            defaultValue={chapterData.note}
            rows={6}
            placeholder="Escreva uma anotação simples sobre o capítulo..."
            style={{
              width: "100%",
              borderRadius: "1rem",
              border: "1px solid var(--border)",
              background: "var(--surface-muted)",
              color: "var(--text)",
              padding: "1rem",
            }}
          />
          <button className="button-primary" type="submit">
            Salvar anotação
          </button>
        </form>
      </section>
    </main>
  );
}
