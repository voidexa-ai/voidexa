import type { MetadataRoute } from 'next'

const SITE_URL = 'https://voidexa.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/control-plane',
          '/control-plane/',
          '/auth',
          '/auth/',
          '/api',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
