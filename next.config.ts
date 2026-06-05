import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project's directory.
    // Suppresses the "multiple lockfiles" warning on the dev machine.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
