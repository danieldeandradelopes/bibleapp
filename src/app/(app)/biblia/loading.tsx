export default function BibleIndexLoading() {
  return (
    <main className="page-container grid-gap" aria-busy="true" aria-live="polite">
      <header className="grid-gap">
        <div>
          <h1 className="section-title">Carregando Bíblia...</h1>
          <p className="section-subtitle">Preparando livros e progresso.</p>
        </div>
      </header>

      {["Antigo Testamento", "Novo Testamento"].map((title) => (
        <section key={title} className="grid-gap">
          <h2 style={{ margin: 0 }}>{title}</h2>
          <div className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={`${title}-${index}`} className="card" style={{ display: "grid", gap: "0.75rem" }}>
                <div className="chip" style={{ width: "4rem", color: "transparent" }}>
                  ...
                </div>
                <div
                  style={{
                    height: "1.15rem",
                    borderRadius: "999px",
                    background: "var(--surface-muted)",
                  }}
                />
                <div
                  style={{
                    height: "0.95rem",
                    width: "55%",
                    borderRadius: "999px",
                    background: "var(--surface-muted)",
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
