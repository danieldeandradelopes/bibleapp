import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { activatePlanAction, createCustomPlanAction } from "@/features/plans/actions";
import { getPlanTemplates } from "@/features/plans/queries";

export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?error=Faça login para ativar um plano.");
  }

  const templates = await getPlanTemplates(session.user.id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="page-container grid-gap">
      <header>
        <h1 className="section-title">Ativar plano</h1>
        <p className="section-subtitle">
          Escolha o plano e a data em que a contagem deve começar.
        </p>
      </header>

      <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card">
          <form action={activatePlanAction} className="grid-gap">
            <strong>Ativar template existente</strong>
            <label className="grid-gap">
              <span>Plano</span>
              <select name="planTemplateId" defaultValue={templates[0]?.id} className="chip">
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid-gap">
              <span>Data de início</span>
              <input name="startDate" type="date" defaultValue={today} className="chip" required />
            </label>

            <button className="button-primary" type="submit">
              Salvar plano ativo
            </button>
          </form>
        </div>

        <div className="card">
          <form action={createCustomPlanAction} className="grid-gap">
            <strong>Criar plano personalizado</strong>
            <label className="grid-gap">
              <span>Nome do plano</span>
              <input name="name" type="text" placeholder="Ex.: Meu plano 180 dias" className="chip" />
            </label>

            <label className="grid-gap">
              <span>Modelo</span>
              <select name="planType" defaultValue="traditional" className="chip">
                <option value="traditional">Tradicional</option>
                <option value="chronological">Cronológico</option>
              </select>
            </label>

            <label className="grid-gap">
              <span>Duração</span>
              <select name="durationDays" defaultValue="180" className="chip">
                <option value="90">90 dias</option>
                <option value="180">180 dias</option>
                <option value="365">365 dias</option>
              </select>
            </label>

            <label className="grid-gap">
              <span>Data de início</span>
              <input name="startDate" type="date" defaultValue={today} className="chip" required />
            </label>

            <button className="button-primary" type="submit">
              Criar e ativar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
