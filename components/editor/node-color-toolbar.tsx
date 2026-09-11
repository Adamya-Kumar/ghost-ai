"use client"

import { NodeToolbar, Position } from "@xyflow/react"
import type { MouseEvent, PointerEvent } from "react"

import { cn } from "@/lib/utils"
import { NODE_COLOR_THEMES, type NodeColorTheme } from "@/types/canvas"

type NodeColorToolbarProps = {
  selected: boolean
  activeBackground: string
  onSelect: (theme: NodeColorTheme) => void
}

function stopCanvasGestures(
  event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>,
) {
  event.stopPropagation()
}

export function NodeColorToolbar({
  selected,
  activeBackground,
  onSelect,
}: NodeColorToolbarProps) {
  if (!selected) {
    return null
  }

  return (
    <NodeToolbar
      isVisible
      position={Position.Top}
      offset={14}
      className="nodrag nopan nowheel"
      onPointerDown={stopCanvasGestures}
    >
      <div
        className="nodrag nopan nowheel flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1.5 shadow-lg"
        onPointerDown={stopCanvasGestures}
      >
        {NODE_COLOR_THEMES.map((theme) => {
          const isActive = theme.background === activeBackground

          return (
            <button
              key={theme.id}
              type="button"
              aria-label={`Apply ${theme.id} node colors`}
              aria-pressed={isActive}
              className={cn(
                "nodrag nopan size-5 rounded-full border border-white/15 transition-[box-shadow,transform]",
                "hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--swatch-text)_80%,transparent),0_0_5px_1px_color-mix(in_oklch,var(--swatch-text)_55%,transparent)]",
                isActive &&
                  "scale-110 ring-2 ring-foreground ring-offset-1 ring-offset-card",
              )}
              style={{
                backgroundColor: theme.background,
                ["--swatch-text" as string]: theme.text,
              }}
              onPointerDown={stopCanvasGestures}
              onClick={(event) => {
                event.stopPropagation()
                onSelect(theme)
              }}
            />
          )
        })}
      </div>
    </NodeToolbar>
  )
}
