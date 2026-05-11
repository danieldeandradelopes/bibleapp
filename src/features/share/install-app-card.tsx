"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallAppCardProps = {
  compact?: boolean;
};

export function InstallAppCard({ compact = false }: InstallAppCardProps) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<"idle" | "installed" | "dismissed" | "unsupported">(() => {
    if (typeof window === "undefined") {
      return "idle";
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

    return isStandalone ? "installed" : "idle";
  });

  useEffect(() => {
    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setStatus("installed");
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setStatus(choice.outcome === "accepted" ? "installed" : "dismissed");
    setInstallEvent(null);
  }

  return (
    <div className="card">
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {!compact && <strong>Instalar o app</strong>}
        <p className="muted" style={{ margin: 0 }}>
          {status === "installed"
            ? "O BibleApp já está instalado e pode ser aberto como app na tela inicial."
            : "Adicione o BibleApp à tela inicial para abrir como webapp instalável no celular."}
        </p>
        {status !== "installed" && (
          <p className="muted" style={{ margin: 0 }}>
            Se o botão não aparecer no seu navegador, use o menu do navegador e escolha a opção
            de instalar ou adicionar à tela inicial.
          </p>
        )}
        {installEvent ? (
          <button className="button-primary" type="button" onClick={installApp}>
            {compact ? "Instalar app" : "Instalar agora"}
          </button>
        ) : status === "dismissed" ? (
          <p className="muted" style={{ margin: 0 }}>
            A instalação foi dispensada. Você pode tentar novamente depois pelo navegador.
          </p>
        ) : null}
      </div>
    </div>
  );
}
