import NextBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import createJiti from "jiti";
import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "node:url";
import path from "path";

// TODO: After the stable version of Million Lint is released, consider using it to further enhance performance.
// Currently, there are bugs in it that can cause the popover component not work.

// validate environment variables during build
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/lib/env");

const isDev = process.env.NODE_ENV === "development";
const isCN = /\.cn(:3000)?$/.test(process.env.NEXT_PUBLIC_APP_URL);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** @type {import("next").NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = "";
let basePath = "";

// 去掉 `<owner>/`
const repo = "json4u";

assetPrefix = `/${repo}/`;
basePath = `/${repo}`;

/** @type {import("next").NextConfig} */
const nextConfig = {
  // not affect auto batching, but it may cause console.log output three times: https://github.com/facebook/react/issues/24570
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  basePath,
  assetPrefix,
  output: "export",
  distDir: "dist",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: [
      "react-use",
      "@next/mdx",
      "lodash-es",
      "lucide-react",
      "monaco-editor",
      "@xyflow/react",
      "@supabase/auth-ui-react",
      "@supabase/auth-ui-shared",
      "@supabase/supabase-js",
      "@sentry/react",
      "@sentry/nextjs",
      "@sentry/utils",
      "zod",
      "usehooks-ts",
    ],
  },
  webpack(config, { dev, isServer, webpack }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": __dirname,
      };
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
      // can't use experiments
      // config.experiments = { asyncWebAssembly: true };

      config.plugins.push(
        new webpack.DefinePlugin({
          __RRWEB_EXCLUDE_IFRAME__: true,
          __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        }),
      );
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.tsx");
const withMDX = createMDX({});
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config = withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));

export default config;
