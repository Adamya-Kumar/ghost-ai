"use client"

import type { DragEvent } from "react"
import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react"

import {
  CANVAS_SHAPES,
  DEFAULT_SHAPE_SIZES,
  SHAPE_DRAG_MIME,
  type CanvasShape,
  type ShapeDragPayload,
} from "@/types/canvas"

const SHAPE_ICONS: Record<CanvasShape, LucideIcon> = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

type ShapePanelProps = {
  onAddShape: (shape: CanvasShape) => void
}

function onShapeDragStart(event: DragEvent<HTMLButtonElement>, shape: CanvasShape) {
  const size = DEFAULT_SHAPE_SIZES[shape]
  const payload: ShapeDragPayload = {
    shape,
    width: size.width,
    height: size.height,
  }

  event.dataTransfer.setData(SHAPE_DRAG_MIME, JSON.stringify(payload))
  event.dataTransfer.effectAllowed = "move"
}

export function ShapePanel({ onAddShape }: ShapePanelProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
      <div className="nopan nodrag pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1.5 shadow-lg">
        {CANVAS_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape]

          return (
            <button
              key={shape}
              type="button"
              draggable
              aria-label={`Add ${shape}`}
              title={shape}
              onClick={() => onAddShape(shape)}
              onDragStart={(event) => onShapeDragStart(event, shape)}
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden />
            </button>
          )
        })}
      </div>
    </div>
  )
}
