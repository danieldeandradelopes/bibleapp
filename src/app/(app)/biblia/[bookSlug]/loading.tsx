export default function BookLoading() {
  return (
    <main className="page-container grid-gap" aria-busy="true" aria-live="polite">
      <header className="grid-gap">
        <div className="muted">Carregando livro...</div>
        <div>
          <h1 className="section-title">Preparando capítulos</h1>
          <p className="section-subtitle">Montando a navegação do livro selecionado.</p>
        </div>
      </header>

      <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))" }}>
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className="card"
            style={{
              display: "grid",
              placeItems: "center",
              minHeight: "88px",
              color: "transparent",
              background: "var(--surface-muted)",
            }}
          >
            <strong>Cap.</strong>
          </div>
        ))}
      </section>
    </main>
  );
}
