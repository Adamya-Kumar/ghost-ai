"use client"

import { createContext, useContext, type ReactNode } from "react"

type ProjectDialogsContextValue = {
  openCreate: () => void
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(
  null
)

export function ProjectDialogsProvider({
  openCreate,
  children,
}: ProjectDialogsContextValue & { children: ReactNode }) {
  return (
    <ProjectDialogsContext.Provider value={{ openCreate }}>
      {children}
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogActions() {
  const context = useContext(ProjectDialogsContext)

  if (!context) {
    throw new Error("useProjectDialogActions must be used within ProjectDialogsProvider")
  }

  return context
}
