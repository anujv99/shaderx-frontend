/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  webpack: (config, options) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
      ],
    },
  ],
};

export default nextConfig;
