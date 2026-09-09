"use client"

import { Plus } from "lucide-react"

import { useProjectDialogActions } from "@/components/editor/project-dialogs-context"
import { Button } from "@/components/ui/button"

export function EditorHome() {
  const { openCreate } = useProjectDialogActions()

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-heading text-2xl font-medium tracking-tight">
        Create a project or open an existing one
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Start a new architecture workspace, or choose a project from the sidebar
      </p>
      <Button type="button" onClick={openCreate}>
        <Plus data-icon="inline-start" />
        New Project
      </Button>
    </div>
  )
}
