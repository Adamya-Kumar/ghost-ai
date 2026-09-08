"use client"

import { useState, type ReactNode } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

type EditorShellProps = {
  children?: ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const dialogs = useProjectDialogs()

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
        onClose={() => setIsSidebarOpen(false)}
        onCreate={dialogs.openCreate}
        onRename={dialogs.openRename}
        onDelete={dialogs.openDelete}
      />
      <ProjectDialogs dialogs={dialogs} />
      <ProjectDialogsProvider openCreate={dialogs.openCreate}>
        <div className="relative min-h-0 flex-1">{children}</div>
      </ProjectDialogsProvider>
    </div>
  )
}
