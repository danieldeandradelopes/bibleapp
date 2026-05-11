import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction, registerAction } from "@/features/auth/actions";
import { getCurrentUserRecord } from "@/features/auth/queries";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const currentUser = session?.user?.id ? await getCurrentUserRecord() : null;

  if (currentUser) {
    redirect("/hoje");
  }

  const params = (await searchParams) ?? {};
  const hasStaleSession = Boolean(session?.user?.id && !currentUser);

  return (
    <main className="page-container" style={{ maxWidth: "64rem" }}>
      <div className="grid-gap" style={{ alignItems: "start", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <section className="card" style={{ display: "grid", gap: "1rem" }}>
          <span className="chip chip-accent">BibleApp</span>
          <h1 className="section-title">Entre para salvar progresso, notas e grupos</h1>
          <p className="section-subtitle">
            O fluxo principal do dia continua enxuto: abrir, ler, montar a mensagem conforme o
            plano e compartilhar mais rápido.
          </p>

          <div className="card-muted">
            <strong>Usuários de seed</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Admin: `admin123` no e-mail definido em `ADMIN_EMAIL`. Usuário demo:
              `user@bibleapp.local` com senha `user123`.
            </p>
          </div>

          {hasStaleSession && (
            <div className="card-muted">
              <strong>Sessão antiga detectada</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                O cookie atual aponta para um usuário que não existe mais no banco. Entre novamente
                para recriar a sessão correta.
              </p>
            </div>
          )}

          <Link className="button-secondary" href="/hoje">
            Continuar explorando sem login
          </Link>
        </section>

        <div className="grid-gap">
          <section className="card" style={{ display: "grid", gap: "1rem" }}>
            <h2 style={{ margin: 0 }}>Entrar</h2>
            {params.error && (
              <p className="card-muted" style={{ margin: 0 }}>
                {params.error}
              </p>
            )}
            <form action={loginAction} className="grid-gap">
              <input name="email" type="email" placeholder="Seu e-mail" required className="chip" />
              <input name="password" type="password" placeholder="Sua senha" required className="chip" />
              <button className="button-primary" type="submit">
                Entrar
              </button>
            </form>
          </section>

          <section className="card" style={{ display: "grid", gap: "1rem" }}>
            <h2 style={{ margin: 0 }}>Criar conta</h2>
            <form action={registerAction} className="grid-gap">
              <input name="name" type="text" placeholder="Seu nome" required className="chip" />
              <input name="email" type="email" placeholder="Seu e-mail" required className="chip" />
              <input name="password" type="password" placeholder="Senha com 6+ caracteres" required className="chip" />
              <button className="button-secondary" type="submit">
                Criar conta
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
