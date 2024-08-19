/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : "",
  trailingSlash: true,
  output: "export",
  webpack: (config, options) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
};

export default nextConfig;
