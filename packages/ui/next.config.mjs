import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(import.meta.dirname, "app/scss")],
  },
};

export default nextConfig;
