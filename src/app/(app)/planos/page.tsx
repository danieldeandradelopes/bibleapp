import Link from "next/link";
import { auth } from "@/auth";
import { getTodayExperience, getPlanTemplates, getUserPlans } from "@/features/plans/queries";
import { translatePlanStatus, translatePlanType } from "@/lib/labels";

export const dynamic = "force-dynamic";

function formatPlanStartDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10).split("-").reverse().join("/");
  }

  const normalized = value.trim().slice(0, 10);
  const [year, month, day] = normalized.split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return value;
}

export default async function PlansPage() {
  const session = await auth();
  const [templates, userPlans, today] = await Promise.all([
    getPlanTemplates(session?.user?.id),
    getUserPlans(session?.user?.id),
    getTodayExperience(session?.user?.id),
  ]);

  return (
    <main className="page-container grid-gap">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="section-title">Planos</h1>
          <p className="section-subtitle">
            Escolha entre cronológico, ordem tradicional anual e Novo Testamento diário.
          </p>
        </div>
        <Link className="button-primary" href="/planos/novo" style={{ whiteSpace: "nowrap" }}>
          Ativar ou criar plano
        </Link>
      </header>

      {today && (
        <section className="card">
          <strong>Plano ativo</strong>
          <p style={{ fontSize: "1.25rem", margin: "0.5rem 0 0" }}>{today.template.name}</p>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>
            Dia {today.dayNumber} • {today.referenceLabel}
          </p>
        </section>
      )}

      <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {templates.map((template) => (
          <article key={template.id} className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span className="chip chip-accent">{translatePlanType(template.plan_type)}</span>
              {template.is_custom && <span className="chip chip-soft">Personalizado</span>}
              {!template.is_public && <span className="chip">Privado</span>}
            </div>
            <strong>{template.name}</strong>
            <p className="muted" style={{ margin: 0 }}>
              {template.description}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              {template.duration_days} dias
            </p>
          </article>
        ))}
      </section>

      {session?.user?.id ? (
        <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Seu histórico de planos</h2>
          {userPlans.length > 0 ? (
            <div className="grid-gap">
              {userPlans.map((plan) => (
                <div key={plan.id} className="card-muted">
                  <strong>{plan.name}</strong>
                  <p className="muted" style={{ margin: "0.25rem 0 0" }}>
                    {translatePlanStatus(plan.status)} • início em {formatPlanStartDate(plan.start_date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              Você ainda não ativou um plano próprio.
            </p>
          )}
        </section>
      ) : (
        <section className="card-muted">
          <strong>Faça login para salvar seu plano</strong>
          <p className="muted" style={{ margin: "0.5rem 0 0" }}>
            Sem login, o app mostra um plano padrão apenas para navegação.
          </p>
        </section>
      )}
    </main>
  );
}
