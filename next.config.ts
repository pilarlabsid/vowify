import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.mp3": {
        loaders: ["file-loader"],
      },
      "*.wav": {
        loaders: ["file-loader"],
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav)$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[hash][ext][query]",
      },
    });
    return config;
  },
};

export default nextConfig;
