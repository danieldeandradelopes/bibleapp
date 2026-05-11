export const dynamic = "force-static";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#55624C"/>
  <rect x="128" y="100" width="256" height="312" rx="24" fill="#FAFAF7" />
  <path d="M160 124h164c15 0 28 13 28 28v208H188c-16 0-28 12-28 28V124z" fill="#FFFFFF"/>
  <path d="M188 360h164v28H188c-16 0-28 12-28 28v-28c0-16 12-28 28-28z" fill="#C2A878"/>
  <path d="M210 188h96" stroke="#55624C" stroke-width="20" stroke-linecap="round"/>
  <path d="M258 140v96" stroke="#55624C" stroke-width="20" stroke-linecap="round"/>
</svg>`;

export function GET(): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
