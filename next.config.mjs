/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The site ships a handful of pre-sized images; there is nothing for the
    // optimizer to do.
    unoptimized: true,
  },

  // Every page lives under app/[lang]. Portuguese keeps the unprefixed URLs
  // (/, /download), which are served by the /pt routes; English and Spanish
  // keep their prefix. These run after static files and metadata routes
  // (icons, robots.txt, sitemap.xml) have had their chance to match.
  async rewrites() {
    return {
      afterFiles: [
        { source: "/", destination: "/pt" },
        {
          source: "/:first((?!(?:en|es|pt)(?:/|$))[^/]+)/:rest*",
          destination: "/pt/:first/:rest*",
        },
      ],
    }
  },

  // /pt URLs would duplicate the unprefixed ones, so they redirect there. The
  // Portuguese preview image stays at /pt/opengraph-image, the URL its meta
  // tag points to, since some link previewers do not follow redirects.
  async redirects() {
    return [
      { source: "/pt", destination: "/", permanent: true },
      {
        source: "/pt/:first((?!opengraph-image(?:/|$))[^/]+)/:rest*",
        destination: "/:first/:rest*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
