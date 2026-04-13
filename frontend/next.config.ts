import type { NextConfig } from "next";
import path from "path";

// Ensure env vars are available before any tooling runs (e.g. browserslist).
if (typeof (process as unknown as { loadEnvFile?: (p: string) => void }).loadEnvFile === "function") {
  (process as unknown as { loadEnvFile: (p: string) => void }).loadEnvFile(path.join(__dirname, ".env.local"));
}

process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA ??= "true";
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
