import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { ServiceWorkerRegister } from "@/features/pwa/service-worker-register";

export const metadata: Metadata = {
  title: "BibleApp",
  description: "Leitura bíblica, planos, progresso e mensagem diária para compartilhar.",
  applicationName: "BibleApp",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BibleApp",
  },
};

export const viewport: Viewport = {
  themeColor: "#55624C",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
