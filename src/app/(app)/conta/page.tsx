import Link from "next/link";
import { auth } from "@/auth";
import {
  changePasswordAction,
  promoteUserToAdminAction,
  savePreferencesAction,
  updateProfileAction,
} from "@/features/account/actions";
import { NotificationPermissionCard } from "@/features/account/notification-permission-card";
import { getStoredUserPreferences } from "@/features/account/preferences";
import { getReminderSummary } from "@/features/account/queries";
import { signOutAction } from "@/features/auth/actions";
import { getCurrentUserRecord } from "@/features/auth/queries";
import { setPreferredTranslationAction } from "@/features/reading/actions";
import { TranslationPicker } from "@/features/reading/translation-picker";
import { resolvePreferredTranslation } from "@/features/reading/translations";
import { InstallAppCard } from "@/features/share/install-app-card";
import { translateUserRole } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  const user = await getCurrentUserRecord();
  const [preferences, reminderSummary, translationState] = await Promise.all([
    getStoredUserPreferences(session?.user?.id),
    getReminderSummary(session?.user?.id),
    resolvePreferredTranslation(session?.user?.id),
  ]);

  return (
    <main className="page-container grid-gap">
      <header>
        <h1 className="section-title">Conta</h1>
        <p className="section-subtitle">
          Perfil, autenticação e preferências básicas do app.
        </p>
      </header>

      {session?.user?.id && user ? (
        <>
          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <strong>{user.name}</strong>
              <span className="chip chip-accent">{translateUserRole(user.role)}</span>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              {user.email}
            </p>
            <form action={updateProfileAction} className="grid-gap">
              <label className="grid-gap">
                <span>Nome</span>
                <input name="name" defaultValue={user.name} className="chip" required />
              </label>
              <button className="button-secondary" type="submit">
                Atualizar perfil
              </button>
            </form>
          </section>

          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>Permissões atuais</strong>
            <p className="muted" style={{ margin: 0 }}>
              O perfil administrador pode compartilhar a mensagem pronta no WhatsApp. O perfil
              usuário continua com leitura, planos, progresso, notas e grupos.
            </p>
          </section>

          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>Leitura e lembretes</strong>
            <TranslationPicker
              action={setPreferredTranslationAction}
              currentCode={translationState.current?.code ?? ""}
              redirectPath="/conta"
              translations={translationState.translations}
            />
            <form action={savePreferencesAction} className="grid-gap">
              <label className="grid-gap">
                <span>
                  <input
                    name="reminderEnabled"
                    type="checkbox"
                    defaultChecked={preferences.reminderEnabled}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Ativar lembrete diario
                </span>
              </label>

              <label className="grid-gap">
                <span>Horario preferido</span>
                <input name="reminderTime" type="time" defaultValue={preferences.reminderTime} className="chip" />
              </label>

              <label className="grid-gap">
                <span>Fuso horario</span>
                <input
                  name="reminderTimezone"
                  type="text"
                  defaultValue={preferences.reminderTimezone}
                  className="chip"
                />
              </label>

              <button className="button-secondary" type="submit">
                Salvar preferências
              </button>
            </form>
            {reminderSummary && (
              <p className="muted" style={{ margin: 0 }}>
                {reminderSummary.statusLabel}
              </p>
            )}
          </section>

          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>Segurança</strong>
            <form action={changePasswordAction} className="grid-gap">
              <label className="grid-gap">
                <span>Senha atual</span>
                <input name="currentPassword" type="password" className="chip" required />
              </label>
              <label className="grid-gap">
                <span>Nova senha</span>
                <input name="nextPassword" type="password" className="chip" required />
              </label>
              <button className="button-secondary" type="submit">
                Alterar senha
              </button>
            </form>
          </section>

          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>Biblioteca pessoal</strong>
            <p className="muted" style={{ margin: 0 }}>
              Reabra facilmente todos os seus destaques e versiculos favoritados.
            </p>
            <Link className="button-secondary" href="/salvos">
              Abrir salvos
            </Link>
          </section>

          {user.role === "admin" && (
            <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
              <strong>Promover usuario para admin</strong>
              <form action={promoteUserToAdminAction} className="grid-gap">
                <label className="grid-gap">
                  <span>E-mail do usuario</span>
                  <input name="email" type="email" className="chip" placeholder="usuario@bibleapp.local" required />
                </label>
                <button className="button-secondary" type="submit">
                  Promover
                </button>
              </form>
            </section>
          )}

          <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
            <strong>PWA e experiência</strong>
            <p className="muted" style={{ margin: 0 }}>
              O app já expõe manifesto e ícones instaláveis. No celular, abra o menu do navegador e
              use a opção de instalar. O shell principal também foi preparado para leitura offline das
              telas visitadas recentemente.
            </p>
          </section>

          <NotificationPermissionCard />
          <InstallAppCard />

          <form action={signOutAction}>
            <button className="button-danger" type="submit">
              Sair
            </button>
          </form>
        </>
      ) : (
        <section className="card">
          <strong>Você está navegando sem login.</strong>
          <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>
            Faça login para salvar notas, progresso, grupos e seu plano ativo.
          </p>
          <Link className="button-primary" href="/login">
            Ir para login
          </Link>
        </section>
      )}
    </main>
  );
}
