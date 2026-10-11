"use client"

import type React from "react"
import { MotionConfig } from "framer-motion"
import { LanguageProvider } from "@/contexts/language-context"
import { ProjectProvider } from "@/contexts/project-context"
import type { Project } from "@/lib/project"

// reducedMotion="user": framer-motion drops transform animations for visitors
// who ask the system for reduced motion; CSS animations do the same in
// globals.css.
export function Providers({ project, children }: { project: Project; children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <ProjectProvider project={project}>{children}</ProjectProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}
