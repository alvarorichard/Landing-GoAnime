import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProviderWrapper } from "@/components/language-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GoAnime - Player de Anime para Terminal",
  description:
    "Um player de anime simples para terminal, construído em Go, que permite buscar, assistir e baixar episódios diretamente no MPV.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProviderWrapper>{children}</LanguageProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
