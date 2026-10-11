/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The site ships a handful of pre-sized images; there is nothing for the
    // optimizer to do.
    unoptimized: true,
  },
}

export default nextConfig
