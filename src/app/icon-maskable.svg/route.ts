export const dynamic = "force-static";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#55624C"/>
  <circle cx="256" cy="256" r="172" fill="#FAFAF7"/>
  <path d="M180 142h120c19 0 34 15 34 34v174H202c-19 0-34 15-34 34V176c0-19 15-34 34-34z" fill="#FFFFFF"/>
  <path d="M202 350h132v26H202c-19 0-34 15-34 34v-26c0-19 15-34 34-34z" fill="#C2A878"/>
  <path d="M222 208h58" stroke="#55624C" stroke-width="18" stroke-linecap="round"/>
  <path d="M251 178v58" stroke="#55624C" stroke-width="18" stroke-linecap="round"/>
</svg>`;

export function GET(): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
