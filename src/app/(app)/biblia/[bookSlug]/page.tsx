import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getBookWithChapters } from "@/features/reading/queries";

export const dynamic = "force-dynamic";

type BookPageProps = {
  params: Promise<{ bookSlug: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { bookSlug } = await params;
  const session = await auth();
  const book = await getBookWithChapters(bookSlug, session?.user?.id);

  if (!book) {
    notFound();
  }

  return (
    <main className="page-container grid-gap">
      <header>
        <Link href="/biblia" className="muted">
          ← Voltar para livros
        </Link>
        <h1 className="section-title">{book.name}</h1>
        <p className="section-subtitle">
          {book.chapters.filter((chapter) => chapter.completed).length} de {book.chapters.length} capítulos concluídos.
        </p>
      </header>

      <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))" }}>
        {book.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/biblia/${book.slug}/${chapter.chapterNumber}`}
            className="card"
            style={{
              display: "grid",
              placeItems: "center",
              minHeight: "88px",
              background: chapter.completed ? "var(--accent-soft)" : "var(--surface)",
              color: chapter.completed ? "var(--accent)" : "var(--text)",
            }}
          >
            <strong>Cap. {chapter.chapterNumber}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
