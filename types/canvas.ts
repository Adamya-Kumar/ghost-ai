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

export type NodeColorTheme = {
  id: string
  background: string
  text: string
}

export const NODE_COLOR_THEMES: NodeColorTheme[] = [
  {
    id: "teal",
    background: "color-mix(in oklch, var(--primary) 22%, var(--card))",
    text: "var(--primary)",
  },
  {
    id: "slate",
    background: "var(--card)",
    text: "var(--card-foreground)",
  },
  {
    id: "muted",
    background: "var(--muted)",
    text: "var(--muted-foreground)",
  },
  {
    id: "blue",
    background: "oklch(0.28 0.07 250)",
    text: "oklch(0.84 0.1 230)",
  },
  {
    id: "violet",
    background: "oklch(0.28 0.08 300)",
    text: "oklch(0.84 0.1 300)",
  },
  {
    id: "rose",
    background: "color-mix(in oklch, var(--destructive) 32%, var(--card))",
    text: "oklch(0.84 0.12 22)",
  },
  {
    id: "amber",
    background: "oklch(0.32 0.07 70)",
    text: "oklch(0.88 0.12 85)",
  },
  {
    id: "green",
    background: "oklch(0.3 0.07 155)",
    text: "oklch(0.84 0.12 155)",
  },
]

export const DEFAULT_NODE_COLOR = NODE_COLOR_THEMES[0].background
export const DEFAULT_NODE_TEXT_COLOR = NODE_COLOR_THEMES[0].text

export function getNodeColorTheme(background: string): NodeColorTheme {
  return (
    NODE_COLOR_THEMES.find((theme) => theme.background === background) ??
    NODE_COLOR_THEMES[0]
  )
}

export const MIN_NODE_WIDTH = 48
export const MIN_NODE_HEIGHT = 40

export const NODE_LABEL_PLACEHOLDER = "Text"
export const EDGE_LABEL_HINT = "Label"

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
  textColor: string
  shape: CanvasShape
}

export type CanvasEdgeData = {
  label: string
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">

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
