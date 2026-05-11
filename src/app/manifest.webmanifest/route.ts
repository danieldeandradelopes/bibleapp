import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET(): NextResponse {
  return NextResponse.json(
    {
      name: "BibleApp",
      short_name: "BibleApp",
      description: "Leitura bíblica diária com planos, progresso e mensagem pronta do dia.",
      start_url: "/hoje",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#fafaf7",
      theme_color: "#55624C",
      lang: "pt-BR",
      categories: ["books", "lifestyle", "education"],
      icons: [
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      ],
    },
    {
      headers: { "Content-Type": "application/manifest+json" },
    },
  );
}
