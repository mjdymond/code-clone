/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disable for troubleshooting
  swcMinify: false, // Disable minification for clearer errors
  transpilePackages: ["@copilotkit/react-core", "@copilotkit/react-ui", "@copilotkit/react-textarea"],
  experimental: {
    esmExternals: 'loose', // This helps with ESM packages like nanoid
  },
};

module.exports = nextConfig;
