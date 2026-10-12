import type React from "react"
import type { Metadata } from "next"
import { absoluteUrl, alternateUrls, languageOf, localizedPath, openGraph, translate } from "@/lib/i18n"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const language = await languageOf(params)
  const title = translate(language, "meta.download.title")
  const description = translate(language, "meta.download.description")

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(localizedPath(language, "/download")), languages: alternateUrls("/download") },
    openGraph: openGraph(language, "/download", `${title} · GoAnime`, description),
  }
}

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children
}
