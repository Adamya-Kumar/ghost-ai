"use client"

import { UserButton } from "@clerk/nextjs"
import {
  FileText,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string | null
  showWorkspaceActions?: boolean
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onShare?: () => void
  onOpenTemplates?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName = null,
  showWorkspaceActions = false,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onShare,
  onOpenTemplates,
}: EditorNavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center border-b border-border bg-background">
      <div className="flex h-full min-w-0 flex-1 items-center gap-3 px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>

        {projectName ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
              <FileText className="size-3.5" aria-hidden />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold text-foreground">
                {projectName}
              </p>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex h-full items-center justify-end gap-2 px-3">
        {showWorkspaceActions ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border bg-transparent"
              aria-label="Open starter templates"
              onClick={onOpenTemplates}
            >
              <LayoutTemplate data-icon="inline-start" className="size-3.5" />
              Templates
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border bg-transparent"
              aria-label="Share project"
              onClick={onShare}
            >
              <Share2 data-icon="inline-start" className="size-3.5" />
              Share
            </Button>
            <Button
              type="button"
              size="sm"
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              aria-pressed={isAiSidebarOpen}
              className={cn(
                isAiSidebarOpen
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
              onClick={onToggleAiSidebar}
            >
              <Sparkles data-icon="inline-start" className="size-3.5" />
              AI
            </Button>
          </>
        ) : null}
        <UserButton />
      </div>
    </header>
  )
}
