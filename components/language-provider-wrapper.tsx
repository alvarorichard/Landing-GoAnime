"use client"

import { LanguageProvider } from "@/contexts/language-context"
import type React from "react"

export function LanguageProviderWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
