import type { Edge, Node } from "@xyflow/react"

export const CANVAS_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

export type CanvasShape = (typeof CANVAS_SHAPES)[number]

export const DEFAULT_NODE_COLOR =
  "color-mix(in oklch, var(--primary) 22%, var(--card))"

export const MIN_NODE_WIDTH = 48
export const MIN_NODE_HEIGHT = 40

export const NODE_LABEL_PLACEHOLDER = "Text"

export const DEFAULT_SHAPE_SIZES: Record<
  CanvasShape,
  { width: number; height: number }
> = {
  rectangle: { width: 160, height: 90 },
  diamond: { width: 150, height: 150 },
  circle: { width: 110, height: 110 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 120, height: 110 },
  hexagon: { width: 130, height: 120 },
}

export const SHAPE_DRAG_MIME = "application/x-canvas-shape"

export type ShapeDragPayload = {
  shape: CanvasShape
  width: number
  height: number
}

export type CanvasNodeData = {
  label: string
  color: string
  shape: CanvasShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">

export function isCanvasShape(value: unknown): value is CanvasShape {
  return (
    typeof value === "string" &&
    (CANVAS_SHAPES as readonly string[]).includes(value)
  )
}

export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("shape" in parsed) ||
      !("width" in parsed) ||
      !("height" in parsed)
    ) {
      return null
    }

    const { shape, width, height } = parsed as {
      shape: unknown
      width: unknown
      height: unknown
    }

    if (
      !isCanvasShape(shape) ||
      typeof width !== "number" ||
      typeof height !== "number" ||
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      return null
    }

    return { shape, width, height }
  } catch {
    return null
  }
}
