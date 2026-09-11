"use client"

import {
  Maximize2,
  Redo2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import type { ReactNode } from "react"

type CanvasControlBarProps = {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

function ControlButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export function CanvasControlBar({
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CanvasControlBarProps) {
  return (
    <div className="pointer-events-none absolute bottom-20 left-5 z-10">
      <div className="nopan nodrag nowheel pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1.5 shadow-lg">
        <ControlButton label="Zoom out" onClick={onZoomOut}>
          <ZoomOut className="size-4" aria-hidden />
        </ControlButton>
        <ControlButton label="Fit view" onClick={onFitView}>
          <Maximize2 className="size-4" aria-hidden />
        </ControlButton>
        <ControlButton label="Zoom in" onClick={onZoomIn}>
          <ZoomIn className="size-4" aria-hidden />
        </ControlButton>
        <div className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ControlButton label="Undo" onClick={onUndo} disabled={!canUndo}>
          <Undo2 className="size-4" aria-hidden />
        </ControlButton>
        <ControlButton label="Redo" onClick={onRedo} disabled={!canRedo}>
          <Redo2 className="size-4" aria-hidden />
        </ControlButton>
      </div>
    </div>
  )
}
