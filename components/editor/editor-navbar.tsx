"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center border-b border-border bg-background">
      <div className="flex h-full flex-1 items-center justify-start px-2">
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
      </div>
      <div className="flex h-full flex-1 items-center justify-center" />
      <div className="flex h-full flex-1 items-center justify-end px-2">
        <UserButton />
      </div>
    </header>
  )
}
