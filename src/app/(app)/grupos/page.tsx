import { auth } from "@/auth";
import { createGroupAction } from "@/features/groups/actions";
import { getGroupProgress, getGroups } from "@/features/groups/queries";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const session = await auth();
  const [groups, progress] = await Promise.all([
    getGroups(session?.user?.id),
    getGroupProgress(session?.user?.id),
  ]);

  return (
    <main className="page-container grid-gap">
      <header>
        <h1 className="section-title">Grupos</h1>
        <p className="section-subtitle">
          Cadastre os grupos em que você acompanha a leitura e marque onde a mensagem do dia foi enviada.
        </p>
      </header>

      {session?.user?.id ? (
        <>
          <section className="grid-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="card">
              <strong>Grupos cadastrados</strong>
              <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{progress.totalGroups}</p>
            </div>
            <div className="card">
              <strong>Compartilhamentos registrados</strong>
              <p style={{ fontSize: "2rem", margin: "0.5rem 0 0.25rem" }}>{progress.totalShares}</p>
            </div>
          </section>

          <section className="card">
            <form action={createGroupAction} className="grid-gap">
              <label className="grid-gap">
                <span>Novo grupo</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex.: Leitura Bíblica da Família"
                  required
                  className="chip"
                />
              </label>
              <button className="button-primary" type="submit">
                Adicionar grupo
              </button>
            </form>
          </section>

          <section className="grid-gap">
            {groups.length > 0 ? (
              progress.sharesByGroup.map((group) => (
                <article key={group.id} className="card">
                  <strong>{group.name}</strong>
                  <p className="muted" style={{ margin: "0.5rem 0 0" }}>
                    {group.total} envio(s) registrados.
                  </p>
                </article>
              ))
            ) : (
              <div className="card-muted">Você ainda não cadastrou grupos.</div>
            )}
          </section>
        </>
      ) : (
        <section className="card-muted">
          Faça login para salvar grupos e registrar o histórico de compartilhamentos.
        </section>
      )}
    </main>
  );
}
