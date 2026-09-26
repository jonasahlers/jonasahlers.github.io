import type { APIRoute } from 'astro';
import { profile } from '../data/profile';
import { initials } from '../lib/format';

// A monogram favicon, generated from the profile name at build time. It mirrors the avatar:
// the sunflower → orange → coral gradient with dark serif initials (favicons can't load web
// fonts, so Georgia stands in for the display serif).
export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffcb56"/>
      <stop offset="0.55" stop-color="#ffa259"/>
      <stop offset="1" stop-color="#ff7e7e"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="url(#g)"/>
  <text x="32" y="42" text-anchor="middle" font-family="'Instrument Serif', Georgia, 'Times New Roman', serif" font-size="30" font-weight="400" letter-spacing="-0.5" fill="#231a14">${initials(profile.name)}</text>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
