"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockOwnedProjects,
  mockSharedProjects,
  type MockProject,
} from "@/lib/mock-projects"
import { cn } from "@/lib/utils"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
  onRename: (project: MockProject) => void
  onDelete: (project: MockProject) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "pointer-events-none fixed top-12 left-0 z-40 flex h-[calc(100vh-3rem)] w-72 translate-x-[-100%] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg transition-transform duration-200 ease-out",
        isOpen && "pointer-events-auto translate-x-0"
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-sidebar-border px-3">
        <h2 className="text-sm font-medium">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="my-projects"
        className="flex min-h-0 flex-1 flex-col gap-0 p-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="min-h-0 flex-1 overflow-y-auto">
          {mockOwnedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {mockOwnedProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  showActions
                  onRename={onRename}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="shared" className="min-h-0 flex-1 overflow-y-auto">
          {mockSharedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-muted-foreground">
              No shared projects yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {mockSharedProjects.map((project) => (
                <ProjectRow key={project.id} project={project} showActions={false} />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Button type="button" className="w-full" onClick={onCreate}>
          <Plus data-icon="inline-start" />
          New Project
        </Button>
      </div>
    </aside>
  )
}

type ProjectRowProps = {
  project: MockProject
  showActions: boolean
  onRename?: (project: MockProject) => void
  onDelete?: (project: MockProject) => void
}

function ProjectRow({
  project,
  showActions,
  onRename,
  onDelete,
}: ProjectRowProps) {
  return (
    <li className="flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-sidebar-accent">
      <span className="min-w-0 flex-1 truncate text-sm">{project.name}</span>
      {showActions ? (
        <span className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename?.(project)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete?.(project)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </span>
      ) : null}
    </li>
  )
}
