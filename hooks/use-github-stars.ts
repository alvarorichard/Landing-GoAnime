"use client"

import { useEffect, useState } from "react"
import { REPO } from "@/lib/releases"

const CACHE_KEY = "goanime:stars"

// The repository's star count, or null until it is known. The unauthenticated
// GitHub API allows 60 requests an hour per visitor, so the count is cached
// for the browser session and a failure simply leaves it out.
export function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        setStars(Number(cached))
        return
      }
    } catch {
      // No session storage; fetch without caching.
    }

    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (typeof data?.stargazers_count !== "number") return
        setStars(data.stargazers_count)
        try {
          sessionStorage.setItem(CACHE_KEY, String(data.stargazers_count))
        } catch {
          // Not cached; harmless.
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return stars
}

export function formatStars(count: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(count)
}
