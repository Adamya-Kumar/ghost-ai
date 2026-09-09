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
        "flex h-full w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,opacity,margin] duration-200 ease-out",
        !isOpen && "pointer-events-none w-0 overflow-hidden border-r-0 opacity-0",
      )}
    >
      <div className="flex h-12 w-72 shrink-0 items-center justify-between border-b border-sidebar-border px-3">
        <h2 className="text-sm font-semibold">Projects</h2>
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
        className="flex w-72 min-h-0 flex-1 flex-col gap-0 p-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent
          value="my-projects"
          className="min-h-0 flex-1 overflow-y-auto pt-3"
        >
          {ownedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
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
        <TabsContent
          value="shared"
          className="min-h-0 flex-1 overflow-y-auto pt-3"
        >
          {sharedProjects.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
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

      <div className="flex w-72 shrink-0 items-center gap-2 border-t border-sidebar-border p-3">
       
        <Button type="button" className="min-w-0 flex-1" onClick={onCreate}>
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
        "group flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 hover:bg-sidebar-accent",
        isActive && "border-primary/35 bg-primary/10",
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          isActive ? "bg-primary" : "bg-transparent",
        )}
        aria-hidden
      />
      <Link
        href={`/editor/${project.id}`}
        className="min-w-0 flex-1 truncate text-sm font-medium"
      >
        {project.name}
      </Link>
      {showActions ? (
        <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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
