import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Download",
  description: "Baixe o GoAnime para Windows, macOS ou Linux, direto da versão mais recente publicada no GitHub.",
  alternates: { canonical: "/download" },
}

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children
}
