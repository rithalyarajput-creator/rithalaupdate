/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/coming-soon', destination: '/', permanent: true },
      { source: '/coming-soon/', destination: '/', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rithalaupdate.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: 'rithalaupdate.files.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Allow serving Hindi (Devanagari) URLs without encoding issues
  trailingSlash: true,
};

export default nextConfig;
