"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppCard() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<"idle" | "installed" | "dismissed">("idle");

  useEffect(() => {
    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  async function installApp() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setStatus(choice.outcome === "accepted" ? "installed" : "dismissed");
    setInstallEvent(null);
  }

  if (!installEvent && status === "idle") {
    return null;
  }

  return (
    <div className="card">
      {installEvent ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <strong>Instalar o app</strong>
          <p className="muted" style={{ margin: 0 }}>
            Adicione o BibleApp à tela inicial para abrir como webapp instalável no celular.
          </p>
          <button className="button-primary" type="button" onClick={installApp}>
            Instalar agora
          </button>
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}>
          {status === "installed"
            ? "App instalado com sucesso."
            : "A instalação foi dispensada. Você pode tentar novamente depois pelo navegador."}
        </p>
      )}
    </div>
  );
}
