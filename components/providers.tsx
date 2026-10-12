"use client"

import type React from "react"
import { useEffect } from "react"
import { ScrollTrigger } from "@/components/motion"
import { LanguageProvider } from "@/contexts/language-context"
import { ProjectProvider } from "@/contexts/project-context"
import type { Language } from "@/lib/i18n"
import type { Project } from "@/lib/project"

export function Providers({
  language,
  project,
  children,
}: {
  language: Language
  project: Project
  children: React.ReactNode
}) {
  // The web fonts arrive after the first layout and change the height of
  // every heading; measure the scroll animations again once they are in.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <LanguageProvider language={language}>
      <ProjectProvider project={project}>{children}</ProjectProvider>
    </LanguageProvider>
  )
}
