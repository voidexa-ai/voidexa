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
