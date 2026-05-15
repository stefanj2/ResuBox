import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingIncludes: {
    '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default withNextIntl(nextConfig);
