/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: process.env.NYAN_TEST_MODE === "fixture" ? ".next-fixture" : ".next",
  outputFileTracingRoot: __dirname,
  experimental: { cpus: 2 },
  // Sanity 6 ships package CSS; Pages Router must include external styles.
  transpilePackages: ["sanity"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/medoptics-image-cloud/**",
      },
    ],
  },
};
