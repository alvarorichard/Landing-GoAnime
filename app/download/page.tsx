"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download,
  Github,
  Apple,
  LaptopIcon as Linux,
  ComputerIcon as Windows,
  Loader2,
  Terminal,
  Command,
  Sparkles,
  Shield,
  Package,
  Cpu,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ParticleBackground from "@/components/particle-background"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CommandMenu } from "@/components/command-menu"
import Image from "next/image"

interface GitHubAsset {
  name: string
  browser_download_url: string
  size: number
}

interface GitHubRelease {
  tag_name: string
  html_url: string
  prerelease: boolean
  published_at: string
  body: string
  assets: GitHubAsset[]
}

type Platform = "darwin" | "linux" | "windows"
type Architecture = "amd64" | "arm64"

interface DownloadOption {
  platform: Platform
  arch: Architecture
  binaryName: string
  archiveName: string | null
  installerName?: string
  downloadUrl: string
  archiveUrl: string | null
  installerUrl?: string
  size: number
  installerSize: number
}

export default function DownloadPage() {
  const { t } = useLanguage()
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCommand, setShowCommand] = useState(false)
  const [selectedArch, setSelectedArch] = useState<Record<Platform, Architecture>>({
    darwin: "arm64",
    linux: "amd64",
    windows: "amd64",
  })

  // Detect user's platform and architecture
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase()
      const platform = navigator.platform.toLowerCase()

      let detectedArch: Architecture = "amd64"

      if (platform.includes("mac") || userAgent.includes("mac")) {
        if (userAgent.includes("arm")) {
          detectedArch = "arm64"
        }
        setSelectedArch((prev) => ({ ...prev, darwin: detectedArch }))
      }

      if (platform.includes("linux") || userAgent.includes("linux")) {
        if (userAgent.includes("aarch64") || userAgent.includes("arm64")) {
          detectedArch = "arm64"
        }
        setSelectedArch((prev) => ({ ...prev, linux: detectedArch }))
      }
    }
  }, [])

  useEffect(() => {
    async function fetchLatestRelease() {
      try {
        setLoading(true)
        const response = await fetch("https://api.github.com/repos/alvarorichard/GoAnime/releases/latest")

        if (!response.ok) {
          throw new Error("GitHub API error: " + response.status)
        }

        const data = await response.json()
        setLatestRelease(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch latest release:", err)
        setError(t("download.error"))
      } finally {
        setLoading(false)
      }
    }

    fetchLatestRelease()
  }, [t])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowCommand((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Parse download options from release assets
  const downloadOptions = useMemo((): Record<Platform, DownloadOption[]> => {
    if (!latestRelease) {
      return { darwin: [], linux: [], windows: [] }
    }

    const options: Record<Platform, DownloadOption[]> = {
      darwin: [],
      linux: [],
      windows: [],
    }

    const platforms: Platform[] = ["darwin", "linux", "windows"]
    const architectures: Architecture[] = ["amd64", "arm64"]

    for (const platform of platforms) {
      for (const arch of architectures) {
        // Windows only has amd64 currently
        if (platform === "windows" && arch === "arm64") continue

        // Binary names: goanime-{platform}-{arch} (no .exe for Windows standalone)
        const binaryName = "goanime-" + platform + "-" + arch
        
        // Archive names: .tar.gz for Unix, .zip for Windows
        const archiveName = platform === "windows" 
          ? "goanime-" + platform + "-" + arch + ".zip" 
          : "goanime-" + platform + "-" + arch + ".tar.gz"

        const binaryAsset = latestRelease.assets.find((a) => a.name === binaryName)
        const archiveAsset = latestRelease.assets.find((a) => a.name === archiveName)

        // Windows installer: GoAnime-Installer-{version}.exe
        let installerAsset: GitHubAsset | undefined
        let installerName: string | undefined
        if (platform === "windows") {
          installerAsset = latestRelease.assets.find((a) => 
            a.name.startsWith("GoAnime-Installer-") && a.name.endsWith(".exe")
          )
          installerName = installerAsset?.name
        }

        // Add option if we have any downloadable asset (binary, archive, or installer)
        if (binaryAsset || archiveAsset || installerAsset) {
          options[platform].push({
            platform,
            arch,
            binaryName,
            archiveName: archiveAsset ? archiveName : null,
            installerName,
            downloadUrl: binaryAsset?.browser_download_url ||
              "https://github.com/alvarorichard/GoAnime/releases/download/" + latestRelease.tag_name + "/" + binaryName,
            archiveUrl: archiveAsset?.browser_download_url || null,
            installerUrl: installerAsset?.browser_download_url,
            size: archiveAsset?.size || binaryAsset?.size || 0,
            installerSize: installerAsset?.size || 0,
          })
        }
      }
    }

    return options
  }, [latestRelease])

  const checksumsUrl = useMemo(() => {
    if (!latestRelease) return null
    const checksumAsset = latestRelease.assets.find((a) => a.name === "checksums-sha256.txt")
    return checksumAsset?.browser_download_url || null
  }, [latestRelease])

  const getDownloadOption = (platform: Platform): DownloadOption | null => {
    const arch = selectedArch[platform]
    return downloadOptions[platform].find((opt) => opt.arch === arch) || downloadOptions[platform][0] || null
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return ""
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(1) + " MB"
  }

  const isPrerelease = latestRelease?.prerelease || (latestRelease?.tag_name?.includes("-") ?? false)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground />

      <AnimatePresence>{showCommand && <CommandMenu onClose={() => setShowCommand(false)} />}</AnimatePresence>

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-teal-500 blur-md opacity-70"></div>
                <Terminal className="h-6 w-6 text-white relative z-10" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                GoAnime
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.features")}
            </Link>
            <Link href="/#installation" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.installation")}
            </Link>
            <Link href="/#usage" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {t("nav.usage")}
            </Link>
            <Link href="/download" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
              {t("nav.download")}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex border-white/20 text-white/70 hover:text-white hover:border-white/50"
              onClick={() => setShowCommand(true)}
            >
              <span className="text-xs">{t("nav.press")}</span>
              <kbd className="pointer-events-none mx-1 inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-black px-1.5 font-mono text-[10px] font-medium text-white/70">
                <span className="text-xs">⌘/Ctrl</span>K
              </kbd>
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0"
            >
              <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-20">
        <section className="relative mb-20 overflow-hidden py-16">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex flex-col items-start text-left md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm backdrop-blur"
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                  <span>{t("download.badge")}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
                >
                  {t("download.title")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl text-white/70 mb-6"
                >
                  {t("download.subtitle")}
                </motion.p>

                {latestRelease && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur border border-white/10">
                      <span>{t("download.version")}</span>
                      <span className="font-mono text-teal-400 font-bold">{latestRelease.tag_name}</span>
                    </div>
                    {isPrerelease && (
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t("download.prerelease")}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
                className="md:w-1/2 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/30 to-purple-600/30 rounded-full blur-xl opacity-75 animate-pulse"></div>
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gofer-05790W7KTaKKhRqGEFvzlWLN89LB06.png"
                      alt="GoAnime mascote"
                      width={300}
                      height={300}
                      className="relative z-10 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 relative z-10 mb-20">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 blur-md opacity-70 animate-pulse"></div>
                  <Loader2 className="h-10 w-10 text-white relative z-10 animate-spin" />
                </div>
                <span className="ml-4 text-white/70 text-lg">{t("download.loading")}</span>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white/5 rounded-lg border border-white/10 max-w-md mx-auto backdrop-blur"
              >
                <div className="mb-4 rounded-full w-16 h-16 flex items-center justify-center bg-red-500/20 mx-auto">
                  <Command className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-red-400 mb-6 text-lg">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {t("download.retry")}
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <DownloadCard
                    platform="darwin"
                    icon={<Apple className="h-10 w-10 text-white" />}
                    title={t("download.mac.title")}
                    description={t("download.mac.description")}
                    option={getDownloadOption("darwin")}
                    availableArchitectures={downloadOptions.darwin.map((o) => o.arch)}
                    selectedArch={selectedArch.darwin}
                    onArchChange={(arch) => setSelectedArch((prev) => ({ ...prev, darwin: arch }))}
                    buttonText={t("download.mac.button")}
                    version={latestRelease?.tag_name || ""}
                    formatSize={formatSize}
                  />

                  <DownloadCard
                    platform="linux"
                    icon={<Linux className="h-10 w-10 text-white" />}
                    title={t("download.linux.title")}
                    description={t("download.linux.description")}
                    option={getDownloadOption("linux")}
                    availableArchitectures={downloadOptions.linux.map((o) => o.arch)}
                    selectedArch={selectedArch.linux}
                    onArchChange={(arch) => setSelectedArch((prev) => ({ ...prev, linux: arch }))}
                    buttonText={t("download.linux.button")}
                    version={latestRelease?.tag_name || ""}
                    formatSize={formatSize}
                  />

                  <DownloadCard
                    platform="windows"
                    icon={<Windows className="h-10 w-10 text-white" />}
                    title={t("download.windows.title")}
                    description={t("download.windows.description")}
                    option={getDownloadOption("windows")}
                    availableArchitectures={downloadOptions.windows.map((o) => o.arch)}
                    selectedArch={selectedArch.windows}
                    onArchChange={(arch) => setSelectedArch((prev) => ({ ...prev, windows: arch }))}
                    buttonText={t("download.windows.button")}
                    version={latestRelease?.tag_name || ""}
                    formatSize={formatSize}
                  />
                </div>

                {checksumsUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                  >
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Shield className="h-4 w-4 text-teal-400" />
                      <span>{t("download.verify")}</span>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white/70 hover:text-white hover:border-white/50"
                    >
                      <Link href={checksumsUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        checksums-sha256.txt
                      </Link>
                    </Button>
                  </motion.div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-white/50 text-sm max-w-lg mx-auto">{t("download.instructions")}</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="container px-4 md:px-6 relative z-10 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600 flex-shrink-0">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{t("download.aur.title")}</h3>
                  <p className="text-white/70 mb-4">{t("download.aur.description")}</p>
                  <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                    <code className="text-teal-400 font-mono text-sm">yay -S goanime</code>
                  </div>
                  <p className="text-white/50 text-sm mt-3">{t("download.aur.alternative")}</p>
                  <div className="bg-black/50 rounded-lg p-4 border border-white/10 mt-2">
                    <code className="text-teal-400 font-mono text-sm">paru -S goanime</code>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-teal-400 inline-block mr-2" />
                <span>{t("download.alternative.title")}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                {t("download.alternative.subtitle")}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                      <Github className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                      {t("download.github.title")}
                    </h3>
                    <p className="text-white/70 mb-6">{t("download.github.description")}</p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 w-full"
                    >
                      <Link
                        href="https://github.com/alvarorichard/GoAnime/releases"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        {t("download.github.button")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
                      <Terminal className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">
                      {t("download.source.title")}
                    </h3>
                    <p className="text-white/70 mb-6">{t("download.source.description")}</p>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full">
                      <Link href="https://github.com/alvarorichard/GoAnime" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {t("download.source.button")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container px-4 md:px-6 relative z-10 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-white/70 backdrop-blur border border-white/10 mb-4">
                <span>{t("download.instructions.badge")}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                {t("download.instructions.title")}
              </h2>

              <p className="text-white/70 max-w-2xl mx-auto">{t("download.instructions.subtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-xl blur-sm opacity-75"></div>
                  <div className="relative bg-black rounded-xl overflow-hidden border border-white/10">
                    <div className="h-8 w-full bg-gray-900/80 flex items-center px-4 gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-4 text-xs text-white/70">terminal</div>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <p className="text-gray-400">
                        <span className="text-purple-400">#</span> {t("download.instructions.extract")}
                      </p>
                      <p className="mt-2 text-gray-400">
                        $ <span className="text-white">tar -xzf goanime-linux-amd64.tar.gz</span>
                      </p>
                      <p className="mt-4 text-gray-400">
                        <span className="text-purple-400">#</span> {t("download.instructions.step2.command")}
                      </p>
                      <p className="mt-2 text-gray-400">
                        $ <span className="text-white">chmod +x goanime-linux-amd64</span>
                      </p>
                      <p className="mt-4 text-gray-400">
                        <span className="text-purple-400">#</span> {t("download.instructions.install")}
                      </p>
                      <p className="mt-2 text-gray-400">
                        $ <span className="text-white">sudo mv goanime-linux-amd64 /usr/local/bin/goanime</span>
                      </p>
                      <p className="mt-4 text-gray-400">
                        $ <span className="text-white">goanime</span>
                      </p>
                      <p className="mt-2 text-teal-400">GoAnime {latestRelease?.tag_name || "v1.6.2"}</p>
                      <p className="mt-1 text-teal-400">{t("download.instructions.starting")}</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-gray-400">$</span>
                        <span className="ml-2 h-4 w-2 bg-white/70 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{t("download.instructions.step1.title")}</h3>
                      <p className="text-white/70">{t("download.instructions.step1.description")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{t("download.instructions.step2.title")}</h3>
                      <p className="text-white/70">{t("download.instructions.step2.description")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{t("download.instructions.step3.title")}</h3>
                      <p className="text-white/70">{t("download.instructions.step3.description")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{t("download.instructions.step4.title")}</h3>
                      <p className="text-white/70">{t("download.instructions.step4.description")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 relative z-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-teal-400" />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
                GoAnime
              </span>
            </div>

            <p className="text-sm text-white/50">
              {t("footer.developed")}{" "}
              <Link
                href="https://github.com/alvarorichard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300"
              >
                alvarorichard
              </Link>
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/alvarorichard/GoAnime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface DownloadCardProps {
  platform: Platform
  icon: React.ReactNode
  title: string
  description: string
  option: DownloadOption | null
  availableArchitectures: Architecture[]
  selectedArch: Architecture
  onArchChange: (arch: Architecture) => void
  buttonText: string
  version: string
  formatSize: (bytes: number) => string
}

function DownloadCard({
  platform,
  icon,
  title,
  description,
  option,
  availableArchitectures,
  selectedArch,
  onArchChange,
  buttonText,
  version,
  formatSize,
}: DownloadCardProps) {
  const { t } = useLanguage()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const archLabels: Record<Architecture, string> = {
    amd64: "x86_64 (Intel/AMD)",
    arm64: platform === "darwin" ? "ARM64 (Apple Silicon)" : "ARM64",
  }

  const primaryDownloadUrl =
    platform === "windows" && option?.installerUrl
      ? option.installerUrl
      : option?.archiveUrl || option?.downloadUrl || "#"

  const primaryFileName =
    platform === "windows" && option?.installerName
      ? option.installerName
      : option?.archiveName || option?.binaryName || ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: platform === "darwin" ? 0.1 : platform === "linux" ? 0.2 : 0.3 }}
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <motion.div
        animate={{ y: isHovered ? -10 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden group relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative z-10 flex flex-col h-full">
            <div className="mb-6 rounded-full w-16 h-16 flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
              {icon}
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors">{title}</h3>

            <p className="text-white/70 mb-4 flex-grow">{description}</p>

            {availableArchitectures.length > 1 && (
              <div className="mb-4">
                <label className="text-white/50 text-sm mb-2 block flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  {t("download.architecture")}
                </label>
                <div className="flex gap-2">
                  {availableArchitectures.map((arch) => (
                    <button
                      key={arch}
                      onClick={() => onArchChange(arch)}
                      className={
                        "px-3 py-1.5 text-xs font-mono rounded-md border transition-all " +
                        (selectedArch === arch
                          ? "bg-teal-500/20 border-teal-500 text-teal-400"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/30")
                      }
                    >
                      {archLabels[arch]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 bg-black/30 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">{t("download.file")}:</span>
                <span className="text-white/80 text-xs font-mono truncate max-w-[180px]">{primaryFileName}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/50 text-sm">{t("download.version")}:</span>
                <span className="text-teal-400 text-sm font-mono">{version}</span>
              </div>
              {(platform === "windows" && option?.installerSize ? option.installerSize : option?.size) ? (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/50 text-sm">{t("download.size")}:</span>
                  <span className="text-white/80 text-sm">
                    {formatSize(platform === "windows" && option?.installerSize ? option.installerSize : option?.size || 0)}
                  </span>
                </div>
              ) : null}
            </div>

            {platform === "windows" && option?.installerUrl && (
              <div className="mb-4 flex items-center gap-2 text-xs text-teal-400">
                <CheckCircle className="h-3 w-3" />
                <span>{t("download.windows.installer.included")}</span>
              </div>
            )}

            <Button
              asChild
              className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 w-full h-12 text-base"
            >
              <Link href={primaryDownloadUrl}>
                <Download className="mr-2 h-5 w-5" />
                {buttonText}
              </Link>
            </Button>

            {platform === "windows" && option?.archiveUrl && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-2 text-white/50 hover:text-white/80"
              >
                <Link href={option.archiveUrl}>
                  <ExternalLink className="mr-2 h-3 w-3" />
                  {t("download.windows.portable")}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
