import Link from "next/link";
import { auth } from "@/auth";
import { getSavedVerses, getSavedVersesSummary } from "@/features/highlights/queries";

export const dynamic = "force-dynamic";

export default async function SavedVersesPage() {
  const session = await auth();
  const [summary, verses] = await Promise.all([
    getSavedVersesSummary(session?.user?.id),
    getSavedVerses(session?.user?.id),
  ]);

  return (
    <main className="page-container grid-gap">
      <header>
        <h1 className="section-title">Salvos</h1>
        <p className="section-subtitle">
          Destaques e favoritos que voce marcou durante a leitura.
        </p>
      </header>

      {session?.user?.id ? (
        <>
          <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div className="card">
              <strong>Itens salvos</strong>
              <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{summary.totalSaved}</p>
            </div>
            <div className="card">
              <strong>Favoritos</strong>
              <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{summary.favorites}</p>
            </div>
            <div className="card">
              <strong>Destaques</strong>
              <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{summary.highlights}</p>
            </div>
          </section>

          {verses.length > 0 ? (
            <section className="grid-gap">
              {verses.map((verse) => (
                <article key={verse.id} className="card" style={{ display: "grid", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span className="chip">{`${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`}</span>
                    {verse.isHighlighted && <span className="chip chip-soft">Destacado</span>}
                    {verse.isFavorite && <span className="chip chip-accent">Favorito</span>}
                  </div>
                  <p className="reading-text" style={{ margin: 0 }}>
                    <strong>{verse.verseNumber}.</strong> {verse.text || "Texto indisponivel nesta versao."}
                  </p>
                  <Link className="button-secondary" href={`/biblia/${verse.bookSlug}/${verse.chapterNumber}`}>
                    Abrir capitulo
                  </Link>
                </article>
              ))}
            </section>
          ) : (
            <section className="card-muted">
              Seus versiculos destacados e favoritos aparecerao aqui conforme voce usar a selecao dentro da leitura.
            </section>
          )}
        </>
      ) : (
        <section className="card">
          <strong>Entre para usar sua biblioteca pessoal.</strong>
          <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>
            O login libera destaques, favoritos e sincronizacao da sua leitura.
          </p>
          <Link className="button-primary" href="/login">
            Ir para login
          </Link>
        </section>
      )}
    </main>
  );
}
