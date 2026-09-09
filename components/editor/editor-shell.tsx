"use client"

import { useParams } from "next/navigation"
import { useState, type ReactNode } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
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
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const params = useParams<{ roomId?: string; projectId?: string }>()
  const activeProjectId =
    typeof params.roomId === "string"
      ? params.roomId
      : typeof params.projectId === "string"
        ? params.projectId
        : null

  const activeProject =
    ownedProjects.find((project) => project.id === activeProjectId) ??
    sharedProjects.find((project) => project.id === activeProjectId) ??
    null

  const showWorkspaceActions = activeProject !== null
  const actions = useProjectActions({ activeProjectId })

  return (
    <div className="relative flex h-dvh min-h-dvh flex-col overflow-hidden bg-background">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={activeProject?.name ?? null}
        showWorkspaceActions={showWorkspaceActions}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
        onShare={() => setIsShareOpen(true)}
      />

      {activeProject ? (
        <ShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          projectId={activeProject.id}
          isOwner={ownedProjects.some(
            (project) => project.id === activeProject.id,
          )}
        />
      ) : null}

      <ProjectDialogs dialogs={actions} />
      <ProjectDialogsProvider openCreate={actions.openCreate}>
        <div className="flex min-h-0 flex-1">
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
          <div className="relative min-h-0 min-w-0 flex-1">{children}</div>
          {showWorkspaceActions && isAiSidebarOpen ? <AiSidebar /> : null}
        </div>
      </ProjectDialogsProvider>
    </div>
  )
}
