import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import { Providers } from "@/components/providers"
import { SITE_URL } from "@/lib/links"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
