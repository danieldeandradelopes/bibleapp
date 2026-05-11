type ChapterContext = {
  summary: string;
  author: string | null;
  historicalPeriod: string | null;
  audience: string | null;
  purpose: string | null;
  curiosities: string | null;
  sourceLabel: string | null;
};

type ChapterContextCardProps = {
  context: ChapterContext | null;
};

export function ChapterContextCard({ context }: ChapterContextCardProps) {
  if (!context) {
    return (
      <section className="card-muted" style={{ display: "grid", gap: "0.5rem" }}>
        <strong>Contexto do capitulo</strong>
        <p className="muted" style={{ margin: 0 }}>
          Este capitulo ainda nao recebeu resumo editorial. A leitura continua disponivel normalmente.
        </p>
      </section>
    );
  }

  const details = [
    { label: "Autor", value: context.author },
    { label: "Contexto historico", value: context.historicalPeriod },
    { label: "Publico", value: context.audience },
    { label: "Motivacao", value: context.purpose },
    { label: "Curiosidades", value: context.curiosities },
  ].filter((item) => item.value);

  return (
    <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <span className="chip chip-accent" style={{ width: "fit-content" }}>
          Contexto do capitulo
        </span>
        <p style={{ margin: 0 }}>{context.summary}</p>
      </div>

      {details.length > 0 && (
        <div className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {details.map((detail) => (
            <div key={detail.label} className="card-muted" style={{ display: "grid", gap: "0.35rem" }}>
              <strong style={{ fontSize: "0.95rem" }}>{detail.label}</strong>
              <p className="muted" style={{ margin: 0 }}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {context.sourceLabel && (
        <p className="muted" style={{ margin: 0 }}>
          Fonte: {context.sourceLabel}
        </p>
      )}
    </section>
  );
}
