import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { ServiceWorkerRegister } from "@/features/pwa/service-worker-register";

const themeScript = `
  (function() {
    try {
      var storedTheme = window.localStorage.getItem("bibleapp-theme");
      var theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
