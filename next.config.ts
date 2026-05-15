import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Bundle the bundled chromium binary into the generate-pdf serverless function.
  // Without this, Next.js's file tracer skips the binary and the function 500s
  // with "input directory does not exist".
  outputFileTracingIncludes: {
    '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
  // Tell Next.js not to bundle these (they're loaded dynamically at runtime).
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default nextConfig;
