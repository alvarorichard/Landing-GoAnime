"use client"

import type React from "react"
import { createContext, useContext } from "react"
import type { Project } from "@/lib/project"

// The project's live numbers, fetched once on the server by the root layout.
const ProjectContext = createContext<Project | undefined>(undefined)

export function ProjectProvider({ project, children }: { project: Project; children: React.ReactNode }) {
  return <ProjectContext.Provider value={project}>{children}</ProjectContext.Provider>
}

export const useProject = (): Project => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
