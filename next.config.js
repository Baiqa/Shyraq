/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Aggregator pulls images from arbitrary publisher domains, so hosts can't
    // be whitelisted. Disabling the optimizer serves images directly from the
    // source instead of proxying them through Next — this closes the open
    // image-proxy vector and avoids Vercel image-optimization quota usage.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
