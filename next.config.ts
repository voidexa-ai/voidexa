import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    // AFS-2 — canonical auth aliases. Users typing /login, /signup, etc. land
    // on the actual auth pages under /auth/*. Permanent (308) so browsers and
    // search engines cache the rewrite.
    { source: '/login',         destination: '/auth/login',  permanent: true },
    { source: '/signin',        destination: '/auth/login',  permanent: true },
    { source: '/signup',        destination: '/auth/signup', permanent: true },
    { source: '/register',      destination: '/auth/signup', permanent: true },
    { source: '/auth/signin',   destination: '/auth/login',  permanent: true },
    { source: '/auth/register', destination: '/auth/signup', permanent: true },
    { source: '/account',       destination: '/profile',     permanent: true },

    // Danish locale mirrors. Danish auth pages re-export the English forms
    // under /dk/auth/*.
    { source: '/dk/login',         destination: '/dk/auth/login',  permanent: true },
    { source: '/dk/signin',        destination: '/dk/auth/login',  permanent: true },
    { source: '/dk/signup',        destination: '/dk/auth/signup', permanent: true },
    { source: '/dk/register',      destination: '/dk/auth/signup', permanent: true },
    { source: '/dk/auth/signin',   destination: '/dk/auth/login',  permanent: true },
    { source: '/dk/auth/register', destination: '/dk/auth/signup', permanent: true },
    { source: '/dk/account',       destination: '/dk/profile',     permanent: true },

    // AFS-3 — canonical game hub aliases. The underlying features already
    // live at pre-existing routes; typed canonical URLs used in docs and P0
    // audits should resolve to them.
    { source: '/game/card-battle',   destination: '/game/battle',              permanent: true },
    { source: '/game/deck-builder',  destination: '/game/cards/deck-builder',  permanent: true },
    { source: '/game/pilot-profile', destination: '/game/profile',             permanent: true },
    { source: '/game/shop',          destination: '/shop',                     permanent: true },

    // Danish mirrors for game canonical aliases. /dk/game/* is not yet a
    // fully localised surface, so mirrors target the canonical English
    // routes until AFS-26 ships proper DK translations.
    { source: '/dk/game/card-battle',   destination: '/game/battle',              permanent: true },
    { source: '/dk/game/deck-builder',  destination: '/game/cards/deck-builder',  permanent: true },
    { source: '/dk/game/pilot-profile', destination: '/game/profile',             permanent: true },
    { source: '/dk/game/shop',          destination: '/shop',                     permanent: true },

    // AFS-18 - V3 deck-builder retired. The Alpha deck-builder under
    // /cards/alpha/deck-builder is the canonical surface. Permanent (308)
    // so users who bookmarked /cards/deck-builder land on the Alpha builder.
    // /cards/deck-builder file stays on disk per "V3 stays on disk" rule;
    // the redirect intercepts before Next routes to the V3 page.
    { source: '/cards/deck-builder',    destination: '/cards/alpha/deck-builder',    permanent: true },
    { source: '/dk/cards/deck-builder', destination: '/dk/cards/alpha/deck-builder', permanent: true },

    // AFS-OVERLAY-FIX-V2 — Void Chat renamed to Void Pro AI. The product is a
    // premium AI provider gateway (pay-per-message Claude/ChatGPT/Gemini), not
    // a chat surface. Old folder renamed via git mv; redirects catch existing
    // bookmarks, social shares, and search-index hits at the old path.
    { source: '/void-chat',         destination: '/void-pro-ai',          permanent: true },
    { source: '/void-chat/:path*',  destination: '/void-pro-ai/:path*',   permanent: true },
    { source: '/admin/void-chat',   destination: '/admin/void-pro-ai',    permanent: true },

    // AFS-10 — Starmap Level 2 lockdown. Three canonical aliases:
    //   /space-station ⇒ /station        (Content Hub planet)
    //   /tools         ⇒ /ai-tools       (Creator Suite)
    //   /ai-trading    ⇒ /trading-hub    (merged platform — replaces former
    //                                     server-component redirect that pointed
    //                                     at /trading; /trading-hub is the new
    //                                     canonical home for The Bot, Live,
    //                                     Leaderboard, Backtesting, Beat the
    //                                     House, and Konkurrence.)
    { source: '/space-station', destination: '/station',     permanent: true },
    { source: '/tools',         destination: '/ai-tools',    permanent: true },
    { source: '/ai-trading',    destination: '/trading-hub', permanent: true },
  ],

  headers: async () => [
    {
      // Apply to all routes — middleware also sets these, but this covers
      // static file responses that bypass middleware.
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options',  value: 'nosniff' },
        { key: 'X-Frame-Options',         value: 'DENY' },
        { key: 'X-XSS-Protection',        value: '1; mode=block' },
        { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "media-src 'self' https://ihuljnekxkyqgroklurp.supabase.co https://*.supabase.co blob:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' https: http://localhost:8888;",
        },
      ],
    },
  ],
};

export default nextConfig;
