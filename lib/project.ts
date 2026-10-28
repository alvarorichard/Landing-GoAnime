import { DISCORD_INVITE } from "@/lib/links"
import { REPO, type Release, type ReleaseAsset } from "@/lib/releases"

// The numbers that show the project is alive: stars, downloads, contributors,
// the latest release and the Discord server. They are fetched on the server
// and cached (ten minutes), so they arrive in
// the first HTML and the APIs see a few requests an hour instead of one per
// visitor. Anything that cannot be fetched comes back null or empty, and the
// page leaves it out; a failed request is not cached, so the next render
// tries again.

export interface Contributor {
  login: string
  avatar: string
  url: string
}

export interface Project {
  stars: number | null
  downloads: number | null
  contributors: Contributor[]
  release: Release | null
  discord: { members: number; online: number } | null
}

interface ApiRelease extends Release {
  draft: boolean
  assets: (ReleaseAsset & { download_count: number })[]
}

interface ApiContributor {
  login: string
  avatar_url: string
  html_url: string
  type: string
}

interface ApiInvite {
  approximate_member_count?: number
  approximate_presence_count?: number
}

const MINUTE = 60
// Short enough that a new release or contributor shows up within minutes.
const CACHE = 10 * MINUTE

async function getJSON<T>(url: string, revalidate: number, headers?: Record<string, string>): Promise<T | null> {
  try {
    const res = await fetch(url, { headers, next: { revalidate } })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

export async function getProject(): Promise<Project> {
  // Without a token the GitHub API allows 60 requests an hour per IP, which
  // hosts that share outgoing IPs can run out of. GITHUB_TOKEN raises that to
  // 5,000; it needs no scopes, since everything read here is public.
  const github: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) github.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const api = `https://api.github.com/repos/${REPO}`

  const [repo, releases, contributors, invite] = await Promise.all([
    getJSON<{ stargazers_count: number }>(api, CACHE, github),
    // One page of 100 holds every release so far.
    getJSON<ApiRelease[]>(`${api}/releases?per_page=100`, CACHE, github),
    getJSON<ApiContributor[]>(`${api}/contributors?per_page=100&anon=false`, CACHE, github),
    getJSON<ApiInvite>(`https://discord.com/api/v9/invites/${DISCORD_INVITE}?with_counts=true`, CACHE),
  ])

  // The same release /releases/latest returns: the newest that is neither a
  // draft nor a prerelease.
  const latest = releases?.find((r) => !r.draft && !r.prerelease)
  const members = invite?.approximate_member_count
  const online = invite?.approximate_presence_count

  return {
    stars: repo?.stargazers_count ?? null,
    // Every file of every release except the checksum lists.
    downloads: releases
      ? releases
          .flatMap((r) => r.assets)
          .filter((a) => !a.name.endsWith(".txt"))
          .reduce((sum, a) => sum + a.download_count, 0)
      : null,
    contributors: (contributors ?? [])
      .filter((c) => c.type === "User")
      .map((c) => {
        const avatar = new URL(c.avatar_url)
        avatar.searchParams.set("s", "88")
        return { login: c.login, avatar: avatar.toString(), url: c.html_url }
      }),
    // Only the fields the site reads, so the rest of the API response stays
    // out of the page.
    release: latest
      ? {
          tag_name: latest.tag_name,
          html_url: latest.html_url,
          prerelease: latest.prerelease,
          published_at: latest.published_at,
          assets: latest.assets.map(({ name, browser_download_url, size }) => ({ name, browser_download_url, size })),
        }
      : null,
    discord: members !== undefined && online !== undefined ? { members, online } : null,
  }
}
