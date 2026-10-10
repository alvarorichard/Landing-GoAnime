// Picks the right files out of a GoAnime GitHub release.
//
// The release workflow publishes, per platform:
//   Windows  GoAnime-Installer-<version>.exe (bundles mpv), goanime-windows-amd64.zip
//   macOS    goanime-darwin-universal (+ .tar.gz), one binary for Apple Silicon and Intel
//   Linux    goanime-linux-amd64, goanime-linux-arm64 (each + .tar.gz)
// plus checksums-sha256.txt.

export const REPO = "alvarorichard/GoAnime"
export const RELEASES_URL = `https://github.com/${REPO}/releases`
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`

export type Platform = "windows" | "macos" | "linux"
export type LinuxArch = "amd64" | "arm64"

export interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

export interface Release {
  tag_name: string
  html_url: string
  prerelease: boolean
  published_at: string
  assets: ReleaseAsset[]
}

export interface ReleaseDownloads {
  windows: { installer?: ReleaseAsset; portable?: ReleaseAsset }
  macos: { binary?: ReleaseAsset; archive?: ReleaseAsset }
  linux: Partial<Record<LinuxArch, { binary?: ReleaseAsset; archive?: ReleaseAsset }>>
  checksums?: ReleaseAsset
}

export function pickDownloads(assets: ReleaseAsset[]): ReleaseDownloads {
  const byName = (name: string) => assets.find((a) => a.name === name)

  // Releases before 1.8 shipped one macOS binary per architecture; prefer the
  // universal one and fall back to Apple Silicon.
  const macBase = ["goanime-darwin-universal", "goanime-darwin-arm64", "goanime-darwin-amd64"].find(
    (name) => byName(name) || byName(`${name}.tar.gz`),
  )

  const linux: ReleaseDownloads["linux"] = {}
  for (const arch of ["amd64", "arm64"] as const) {
    const binary = byName(`goanime-linux-${arch}`)
    const archive = byName(`goanime-linux-${arch}.tar.gz`)
    if (binary || archive) linux[arch] = { binary, archive }
  }

  return {
    windows: {
      installer: assets.find((a) => /^GoAnime-Installer-.+\.exe$/.test(a.name)),
      portable: byName("goanime-windows-amd64.zip"),
    },
    macos: macBase ? { binary: byName(macBase), archive: byName(`${macBase}.tar.gz`) } : {},
    linux,
    checksums: byName("checksums-sha256.txt"),
  }
}

// Stable links that always resolve to the newest release, used when the
// GitHub API cannot be reached.
export const fallbackLinks = {
  windows: LATEST_RELEASE_URL,
  macos: `${LATEST_RELEASE_URL}/download/goanime-darwin-universal`,
  linux: (arch: LinuxArch) => `${LATEST_RELEASE_URL}/download/goanime-linux-${arch}.tar.gz`,
}

export function formatSize(bytes: number): string {
  if (!bytes) return ""
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Best guess at the visitor's operating system, for preselecting downloads.
export function detectPlatform(userAgent: string): Platform | null {
  const ua = userAgent.toLowerCase()
  // Phones first: iOS user agents also say "like Mac OS X", Android says "Linux".
  if (/android|iphone|ipad|ipod/.test(ua)) return null
  if (ua.includes("windows")) return "windows"
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macos"
  if (ua.includes("linux")) return "linux"
  return null
}
