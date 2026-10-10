import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/links"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/download`, changeFrequency: "weekly", priority: 0.8 },
  ]
}
