import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-container">
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h1 className="section-title">Página não encontrada</h1>
        <p className="section-subtitle">
          Verifique a rota ou volte para a leitura do dia.
        </p>
        <Link className="button-primary" href="/hoje">
          Ir para Hoje
        </Link>
      </section>
    </main>
  );
}
