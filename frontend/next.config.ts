import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    // ppr: true,
    // Faster TypeScript compilation
    typedEnv: true,
    // Reduce bundle size
    optimizeCss: true,
    optimizeServerReact: true,
    // appDocumentPreloading: true,
    authInterrupts: true,
    preloadEntriesOnStart: true,
    // turbopackRemoveUnusedExports: true,
    // turbopackPersistentCaching: true,
    // turbopackTreeShaking: true,
    appNavFailHandling: true,
    // reactCompiler: true,
    cssChunking: true,
    enablePrerenderSourceMaps: true,

    // Static page generation:
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Optimize for development
  turbopack: {
    // Faster builds in development
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  // Minimize API route bundles
  serverExternalPackages: ["drizzle-orm", "@node-rs/argon2"],
  webpack: (config, { dev }) => {
    if (dev) {
      // Development optimizations:
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true, layers: true };

    return config;
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

const withNextIntlPlugin = createNextIntlPlugin("./src/core/i18n/request.ts");
export default withNextIntlPlugin(nextConfig);