"use client"

import { useParams } from "next/navigation"
import { useState, type ReactNode } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectSummary } from "@/lib/projects"

type EditorShellProps = {
  children?: ReactNode
  ownedProjects: ProjectSummary[]
  sharedProjects?: ProjectSummary[]
}

export function EditorShell({
  children,
  ownedProjects,
  sharedProjects = [],
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const params = useParams<{ projectId?: string }>()
  const activeProjectId =
    typeof params.projectId === "string" ? params.projectId : null
  const actions = useProjectActions({ activeProjectId })

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-x-0 top-12 bottom-0 z-30 bg-background/80 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeProjectId}
        onClose={() => setIsSidebarOpen(false)}
        onCreate={actions.openCreate}
        onRename={actions.openRename}
        onDelete={actions.openDelete}
      />
      <ProjectDialogs dialogs={actions} />
      <ProjectDialogsProvider openCreate={actions.openCreate}>
        <div className="relative min-h-0 flex-1">{children}</div>
      </ProjectDialogsProvider>
    </div>
  )
}
