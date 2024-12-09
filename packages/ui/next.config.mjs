import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    "power-putty-io": {
      engine: "local",
      local: {
        rootDirectory:
          "/home/greg/Checkouts/climbing-app/packages/ui/public/uploads",
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
    config.resolve.alias.config$ = path.join(
      import.meta.dirname,
      "./app/api/config"
    );
    return config;
  },
};

export default nextConfig;
