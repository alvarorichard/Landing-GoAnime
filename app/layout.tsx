import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import { ConsoleGreeting } from "@/components/console-greeting"
import { Providers } from "@/components/providers"
import { SITE_URL, links } from "@/lib/links"
import { getProject } from "@/lib/project"

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })

const title = "GoAnime: anime no terminal"
const description =
  "Busque, assista e baixe anime, filmes e séries pelo terminal, em português e inglês. Código aberto, para Linux, macOS e Windows."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s · GoAnime" },
  description,
  applicationName: "GoAnime",
  keywords: ["GoAnime", "anime", "terminal", "CLI", "TUI", "mpv", "Go", "open source", "ani-cli"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "GoAnime",
    title,
    description,
    locale: "pt_BR",
    alternateLocale: ["en_US", "es_ES"],
  },
  twitter: { card: "summary_large_image", title, description },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const project = await getProject()

  // Tells search engines and AI answers what GoAnime is. Google shows a rich
  // result for software only alongside user ratings, which the project does
  // not collect, so this changes no snippet there.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GoAnime",
    description,
    url: SITE_URL,
    image: `${SITE_URL}/brand/goanime-mark.png`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Linux, macOS, Windows",
    ...(project.release && { softwareVersion: project.release.tag_name.replace(/^v/i, "") }),
    downloadUrl: `${SITE_URL}/download`,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: links.license,
    author: { "@type": "Person", name: "alvarorichard", url: links.author },
    sameAs: [links.github],
  }

  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Providers project={project}>{children}</Providers>
        <ConsoleGreeting />
      </body>
    </html>
  )
}
