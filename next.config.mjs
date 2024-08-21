/** @type {import('next').NextConfig} */

import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";

const nextConfig = {
  webpack: (config, options) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    config.plugins.push(
      new MonacoEditorWebpackPlugin({
        languages: ["wgsl"],
      }),
    );
    return config;
  },
};

export default nextConfig;
