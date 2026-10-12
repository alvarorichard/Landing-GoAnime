import type { MetadataRoute } from "next"
import { LANGUAGES, absoluteUrl, alternateUrls, localizedPath } from "@/lib/i18n"

const PAGES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/download", changeFrequency: "weekly", priority: 0.8 },
]

// Every page in every language, each listing its translations.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    LANGUAGES.map(({ code }) => ({
      url: absoluteUrl(localizedPath(code, path)),
      changeFrequency,
      priority,
      alternates: { languages: alternateUrls(path) },
    })),
  )
}
