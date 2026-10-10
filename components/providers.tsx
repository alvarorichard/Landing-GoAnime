"use client"

import type React from "react"
import { MotionConfig } from "framer-motion"
import { LanguageProvider } from "@/contexts/language-context"

// reducedMotion="user": framer-motion drops transform animations for visitors
// who ask the system for reduced motion; CSS animations do the same in
// globals.css.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>{children}</LanguageProvider>
    </MotionConfig>
  )
}
