import type React from "react"
import type { Metadata, Viewport } from "next"
import { Dela_Gothic_One, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import "@/app/globals.css"
import { ConsoleGreeting } from "@/components/console-greeting"
import { Providers } from "@/components/providers"
import {
  LANGUAGES,
  absoluteUrl,
  alternateUrls,
  htmlLang,
  languageOf,
  localizedPath,
  openGraph,
  translate,
} from "@/lib/i18n"
import { SITE_URL, links } from "@/lib/links"
import { getProject } from "@/lib/project"

// Dela Gothic One, a heavy Japanese gothic, for headlines and the katakana
// accents; IBM Plex for text and for everything that reads like a terminal.
const display = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-dela",
  display: "swap",
})
const sans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-plex-sans",
  display: "swap",
})
const mono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-plex-mono", display: "swap" })

type Params = { params: Promise<{ lang: string }> }

// One static copy of every page per language. The rewrites in next.config
// make sure the first segment is always one of them, and languageOf turns
// anything else into a 404.
export function generateStaticParams() {
  return LANGUAGES.map(({ code }) => ({ lang: code }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const language = await languageOf(params)
  const title = translate(language, "meta.title")
  const description = translate(language, "meta.description")

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s · GoAnime" },
    description,
    applicationName: "GoAnime",
    keywords: ["GoAnime", "anime", "terminal", "CLI", "TUI", "mpv", "Go", "open source", "ani-cli"],
    alternates: { canonical: absoluteUrl(localizedPath(language, "/")), languages: alternateUrls("/") },
    openGraph: openGraph(language, "/", title, description),
    twitter: { card: "summary_large_image", title, description },
  }
}

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  colorScheme: "dark",
}

// Rebuilt in the background at most every ten minutes, so the release and the
// counters never go stale however long the deployment has been up.
export const revalidate = 600

export default async function RootLayout({ children, params }: Params & { children: React.ReactNode }) {
  const language = await languageOf(params)
  const project = await getProject()

  // Tells search engines and AI answers what GoAnime is. Google shows a rich
  // result for software only alongside user ratings, which the project does
  // not collect, so this changes no snippet there.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GoAnime",
    description: translate(language, "meta.description"),
    inLanguage: htmlLang(language),
    url: absoluteUrl(localizedPath(language, "/")),
    image: `${SITE_URL}/brand/goanime-mark.png`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Linux, macOS, Windows",
    ...(project.release && { softwareVersion: project.release.tag_name.replace(/^v/i, "") }),
    downloadUrl: absoluteUrl(localizedPath(language, "/download")),
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: links.license,
    author: { "@type": "Person", name: "alvarorichard", url: links.author },
    sameAs: [links.github],
  }

  return (
    // data-scroll-behavior lets Next.js turn off the smooth scrolling from
    // globals.css while it moves to another page, so a new page opens at its
    // top instead of gliding there.
    <html
      lang={htmlLang(language)}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Providers language={language} project={project}>
          {children}
        </Providers>
        <ConsoleGreeting />
      </body>
    </html>
  )
}
