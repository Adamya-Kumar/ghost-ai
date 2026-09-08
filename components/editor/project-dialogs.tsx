"use client"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProjectDialogsState } from "@/hooks/use-project-dialogs"

type ProjectDialogsProps = {
  dialogs: ProjectDialogsState
}

export function ProjectDialogs({ dialogs }: ProjectDialogsProps) {
  const {
    dialog,
    activeProject,
    createName,
    createSlug,
    renameName,
    isLoading,
    setCreateName,
    setRenameName,
    closeDialog,
    submitCreate,
    submitRename,
    confirmDelete,
  } = dialogs

  return (
    <>
      <EditorDialog
        open={dialog === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        title="Create project"
        description="Name this architecture workspace. The slug updates as you type."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" form="create-project-form" disabled={isLoading}>
              Create
            </Button>
          </>
        }
      >
        <form id="create-project-form" className="grid gap-3" onSubmit={submitCreate}>
          <label className="grid gap-1.5 text-sm">
            <span>Project name</span>
            <Input
              value={createName}
              onChange={(event) => setCreateName(event.target.value)}
              placeholder="Payment Gateway"
              autoComplete="off"
              disabled={isLoading}
            />
          </label>
          <p className="font-mono text-xs text-muted-foreground">
            Slug: {createSlug || "—"}
          </p>
        </form>
      </EditorDialog>

      <EditorDialog
        open={dialog === "rename"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        title="Rename project"
        description={
          activeProject
            ? `Current name: ${activeProject.name}`
            : undefined
        }
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" form="rename-project-form" disabled={isLoading}>
              Save
            </Button>
          </>
        }
      >
        <form id="rename-project-form" className="grid gap-3" onSubmit={submitRename}>
          <label className="grid gap-1.5 text-sm">
            <span>Project name</span>
            <Input
              value={renameName}
              onChange={(event) => setRenameName(event.target.value)}
              autoComplete="off"
              autoFocus
              disabled={isLoading}
            />
          </label>
        </form>
      </EditorDialog>

      <EditorDialog
        open={dialog === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        title="Delete project"
        description={
          activeProject
            ? `This will permanently delete “${activeProject.name}”. This cannot be undone.`
            : "This cannot be undone."
        }
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </>
        }
      />
    </>
  )
}
