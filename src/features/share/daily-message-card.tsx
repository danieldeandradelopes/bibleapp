"use client";

import { useMemo, useState } from "react";

type DailyMessageCardProps = {
  defaultMessage: string;
  referenceLabel: string;
  canShare: boolean;
  children?: React.ReactNode;
};

export function DailyMessageCard({
  defaultMessage,
  referenceLabel,
  canShare,
  children,
}: DailyMessageCardProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const whatsappHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(message)}`,
    [message],
  );

  async function copyMessage(): Promise<void> {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="card" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gap: "0.4rem" }}>
        <span className="chip chip-accent">Mensagem do dia</span>
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{referenceLabel}</h2>
        <p className="muted" style={{ margin: 0 }}>
          A mensagem já nasce pronta com a data e os capítulos do plano do dia.
        </p>
      </div>

      <textarea
        aria-label="Mensagem pronta para compartilhar"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={6}
        style={{
          width: "100%",
          borderRadius: "1rem",
          border: "1px solid var(--border)",
          background: "var(--surface-muted)",
          color: "var(--text)",
          padding: "1rem",
        }}
      />

      {canShare ? (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a className="button-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            Enviar no WhatsApp
          </a>
          <button className="button-secondary" type="button" onClick={copyMessage}>
            {copied ? "Copiado" : "Copiar mensagem"}
          </button>
        </div>
      ) : (
        <div className="card-muted">
          <strong>Envio restrito ao admin</strong>
          <p className="muted" style={{ margin: "0.5rem 0 0" }}>
            O perfil `user` pode ver a referência e acompanhar a leitura, mas o compartilhamento
            pronto do WhatsApp fica reservado ao admin.
          </p>
        </div>
      )}

      {children}
    </section>
  );
}
