"use client";

import { useState } from "react";

type PermissionState = NotificationPermission | "unsupported";

export function NotificationPermissionCard() {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (typeof window === "undefined") {
      return "default";
    }

    if (!("Notification" in window)) {
      return "unsupported";
    }

    return window.Notification.permission;
  });

  async function requestPermission(): Promise<void> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    const nextPermission = await window.Notification.requestPermission();
    setPermission(nextPermission);
  }

  if (permission === "unsupported") {
    return (
      <div className="card-muted">
        Este navegador nao oferece suporte a notificacoes locais.
      </div>
    );
  }

  return (
    <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <strong>Notificacoes do navegador</strong>
      <p className="muted" style={{ margin: 0 }}>
        {permission === "granted"
          ? "Permissao concedida. O app ja esta preparado para lembretes locais e futuras notificacoes."
          : permission === "denied"
            ? "As notificacoes estao bloqueadas. Reative nas configuracoes do navegador se quiser usar lembretes."
            : "Ative as notificacoes para preparar o app para lembretes locais no navegador."}
      </p>
      {permission !== "granted" && permission !== "denied" && (
        <button className="button-secondary" type="button" onClick={requestPermission}>
          Permitir notificacoes
        </button>
      )}
    </div>
  );
}
