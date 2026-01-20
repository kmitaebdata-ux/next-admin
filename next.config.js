/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // Shims Node.js modules for the browser
      fs: { browser: false },
      path: { browser: false },
      os: { browser: false },
    },
  },
};

module.exports = nextConfig;