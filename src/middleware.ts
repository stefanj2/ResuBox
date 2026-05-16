import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths EXCEPT:
  //   /api/*, /_next/*, /_vercel/*, /admin/*, /betalen/*, /betaald/*,
  //   /auth/*, /dashboard, /login, sitemap.xml, robots.txt, favicons.
  // The admin / payment / auth surfaces stay NL-only — they're operational, not user-facing.
  matcher: [
    '/((?!api|_next|_vercel|admin|opengraph-image|icon|apple-icon|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
