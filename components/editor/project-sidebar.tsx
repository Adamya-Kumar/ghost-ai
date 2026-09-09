"use client"

import Link from "next/link"
import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProjectActionTarget } from "@/hooks/use-project-actions"
import type { ProjectSummary } from "@/lib/projects"
import { cn } from "@/lib/utils"

type ProjectSidebarProps = {
  isOpen: boolean
  ownedProjects: ProjectSummary[]
  sharedProjects: ProjectSummary[]
  activeProjectId?: string | null
  onClose: () => void
  onCreate: () => void
  onRename: (project: ProjectActionTarget) => void
  onDelete: (project: ProjectActionTarget) => void
}

export function ProjectSidebar({
  isOpen,
  ownedProjects,
  sharedProjects,
  activeProjectId,
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
        isOpen && "pointer-events-auto translate-x-0",
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
          {ownedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-muted-foreground">
              No projects yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {ownedProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  showActions
                  onRename={onRename}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="shared" className="min-h-0 flex-1 overflow-y-auto">
          {sharedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-muted-foreground">
              No shared projects yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {sharedProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  showActions={false}
                />
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
  project: ProjectSummary
  isActive: boolean
  showActions: boolean
  onRename?: (project: ProjectActionTarget) => void
  onDelete?: (project: ProjectActionTarget) => void
}

function ProjectRow({
  project,
  isActive,
  showActions,
  onRename,
  onDelete,
}: ProjectRowProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent",
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="min-w-0 flex-1 truncate text-sm"
      >
        {project.name}
      </Link>
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
