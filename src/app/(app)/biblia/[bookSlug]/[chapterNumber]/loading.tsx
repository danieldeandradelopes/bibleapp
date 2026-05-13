export default function ChapterLoading() {
  return (
    <main className="page-container grid-gap" aria-busy="true" aria-live="polite">
      <header className="grid-gap">
        <div className="grid-gap">
          <div className="muted">Carregando capítulo...</div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div
              style={{
                height: "2rem",
                width: "14rem",
                borderRadius: "999px",
                background: "var(--surface-muted)",
              }}
            />
            <div
              style={{
                height: "1rem",
                width: "20rem",
                maxWidth: "100%",
                borderRadius: "999px",
                background: "var(--surface-muted)",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div className="button-secondary" style={{ color: "transparent" }}>
            Capítulo anterior
          </div>
          <div className="button-secondary" style={{ color: "transparent" }}>
            Próximo capítulo
          </div>
        </div>
      </header>

      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0 }}>Carregando texto</h2>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} style={{ display: "grid", gap: "0.5rem" }}>
            <div
              style={{
                height: "1rem",
                width: `${92 - index * 7}%`,
                borderRadius: "999px",
                background: "var(--surface-muted)",
              }}
            />
            <div
              style={{
                height: "1rem",
                width: `${78 - index * 5}%`,
                borderRadius: "999px",
                background: "var(--surface-muted)",
              }}
            />
          </div>
        ))}
      </section>

      <section className="card-muted" style={{ display: "grid", gap: "0.75rem" }}>
        <strong>Preparando contexto e anotações</strong>
        <p className="muted" style={{ margin: 0 }}>
          A leitura será exibida assim que os dados do capítulo forem carregados.
        </p>
      </section>
    </main>
  );
}
