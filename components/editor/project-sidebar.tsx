"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
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
        <TabsContent
          value="my-projects"
          className="flex flex-1 items-center justify-center text-center text-muted-foreground"
        >
          No projects yet.
        </TabsContent>
        <TabsContent
          value="shared"
          className="flex flex-1 items-center justify-center text-center text-muted-foreground"
        >
          No shared projects yet.
        </TabsContent>
      </Tabs>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Button type="button" className="w-full">
          <Plus data-icon="inline-start" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
