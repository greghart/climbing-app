import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    "power-putty-io": {
      engine: "local",
      local: {
        rootDirectory: process.env.POWER_PUTTY_IO_UPLOADS,
      },
    },
  },
  sassOptions: {
    includePaths: [path.join(import.meta.dirname, "app/_scss")],
  },
  serverExternalPackages: ["typeorm"],
  webpack: (config, { require, isServer }) => {
    if (!isServer) return config;

    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // node-config incompatible
    config.resolve.alias.config$ = path.join(
      import.meta.dirname,
      "./app/api/config"
    );
    // canvas incompatibility
    config.resolve.alias["konva"] = false;
    config.resolve.alias["react-konva"] = false;
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
