import Link from "next/link";
import { auth } from "@/auth";
import { getBooks } from "@/features/reading/queries";

export const dynamic = "force-dynamic";

export default async function BibleIndexPage() {
  const session = await auth();
  const books = await getBooks(session?.user?.id);
  const oldTestament = books.filter((book) => book.testament === "old");
  const newTestament = books.filter((book) => book.testament === "new");

  return (
    <main className="page-container grid-gap">
      <header>
        <h1 className="section-title">Bíblia</h1>
        <p className="section-subtitle">
          Navegue por livros e capítulos. O app já está preparado para usar a ARC como tradução
          padrão após a importação para o banco.
        </p>
      </header>

      {[["Antigo Testamento", oldTestament], ["Novo Testamento", newTestament]].map(([title, sectionBooks]) => (
        <section key={title as string} className="grid-gap">
          <h2 style={{ margin: 0 }}>{title as string}</h2>
          <div className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {(sectionBooks as typeof books).map((book) => {
              const progressLabel =
                book.totalChapters > 0
                  ? `${book.completedChapters}/${book.totalChapters} capítulos`
                  : "Sem capítulos";

              return (
                <Link key={book.id} href={`/biblia/${book.slug}`} className="card" style={{ display: "grid", gap: "0.5rem" }}>
                  <span className="chip">{book.abbreviation}</span>
                  <strong>{book.name}</strong>
                  <p className="muted" style={{ margin: 0 }}>
                    {progressLabel}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
