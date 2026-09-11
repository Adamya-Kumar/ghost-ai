import {
  DEFAULT_SHAPE_SIZES,
  NODE_COLOR_THEMES,
  type CanvasEdge,
  type CanvasNode,
  type CanvasShape,
} from "@/types/canvas"

export type CanvasTemplate = {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

function colorTheme(id: string) {
  const theme =
    NODE_COLOR_THEMES.find((item) => item.id === id) ?? NODE_COLOR_THEMES[0]

  return {
    color: theme.background,
    textColor: theme.text,
  }
}

type TemplateNodeInput = {
  id: string
  label: string
  shape: CanvasShape
  x: number
  y: number
  theme: string
  width?: number
  height?: number
}

function templateNode({
  id,
  label,
  shape,
  x,
  y,
  theme,
  width,
  height,
}: TemplateNodeInput): CanvasNode {
  const size = DEFAULT_SHAPE_SIZES[shape]
  const nodeWidth = width ?? size.width
  const nodeHeight = height ?? size.height
  const colors = colorTheme(theme)

  return {
    id,
    type: "canvasNode",
    position: { x, y },
    width: nodeWidth,
    height: nodeHeight,
    style: { width: nodeWidth, height: nodeHeight },
    data: {
      label,
      shape,
      color: colors.color,
      textColor: colors.textColor,
    },
  }
}

type TemplateEdgeInput = {
  id: string
  source: string
  target: string
  label?: string
  sourceHandle?: string
  targetHandle?: string
}

function templateEdge({
  id,
  source,
  target,
  label = "",
  sourceHandle,
  targetHandle,
}: TemplateEdgeInput): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    sourceHandle,
    targetHandle,
    data: { label },
  }
}

export function cloneTemplateGraph(template: CanvasTemplate): {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
} {
  return {
    nodes: template.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      style: node.style ? { ...node.style } : undefined,
      data: { ...node.data },
    })),
    edges: template.edges.map((edge) => ({
      ...edge,
      data: { ...edge.data },
    })),
  }
}

const microservices: CanvasTemplate = {
  id: "microservices",
  name: "Microservices",
  description:
    "Client traffic through an API gateway to auth, orders, and catalog services.",
  nodes: [
    templateNode({
      id: "ms-client",
      label: "Client",
      shape: "pill",
      x: 0,
      y: 150,
      theme: "slate",
    }),
    templateNode({
      id: "ms-gateway",
      label: "API Gateway",
      shape: "hexagon",
      x: 220,
      y: 130,
      theme: "teal",
    }),
    templateNode({
      id: "ms-auth",
      label: "Auth",
      shape: "rectangle",
      x: 460,
      y: 0,
      theme: "blue",
    }),
    templateNode({
      id: "ms-orders",
      label: "Orders",
      shape: "rectangle",
      x: 460,
      y: 150,
      theme: "violet",
    }),
    templateNode({
      id: "ms-catalog",
      label: "Catalog",
      shape: "rectangle",
      x: 460,
      y: 300,
      theme: "green",
    }),
    templateNode({
      id: "ms-orders-db",
      label: "Orders DB",
      shape: "cylinder",
      x: 700,
      y: 145,
      theme: "amber",
    }),
    templateNode({
      id: "ms-catalog-db",
      label: "Catalog DB",
      shape: "cylinder",
      x: 700,
      y: 295,
      theme: "muted",
    }),
  ],
  edges: [
    templateEdge({
      id: "ms-e1",
      source: "ms-client",
      target: "ms-gateway",
      sourceHandle: "right",
      targetHandle: "left",
      label: "HTTPS",
    }),
    templateEdge({
      id: "ms-e2",
      source: "ms-gateway",
      target: "ms-auth",
      sourceHandle: "top",
      targetHandle: "left",
      label: "JWT",
    }),
    templateEdge({
      id: "ms-e3",
      source: "ms-gateway",
      target: "ms-orders",
      sourceHandle: "right",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ms-e4",
      source: "ms-gateway",
      target: "ms-catalog",
      sourceHandle: "bottom",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ms-e5",
      source: "ms-orders",
      target: "ms-orders-db",
      sourceHandle: "right",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ms-e6",
      source: "ms-catalog",
      target: "ms-catalog-db",
      sourceHandle: "right",
      targetHandle: "left",
    }),
  ],
}

const cicdPipeline: CanvasTemplate = {
  id: "cicd-pipeline",
  name: "CI/CD Pipeline",
  description:
    "A linear delivery path from the repository through build, test, staging, and production.",
  nodes: [
    templateNode({
      id: "ci-repo",
      label: "Git Repo",
      shape: "cylinder",
      x: 0,
      y: 80,
      theme: "slate",
    }),
    templateNode({
      id: "ci-build",
      label: "Build",
      shape: "rectangle",
      x: 200,
      y: 90,
      theme: "blue",
    }),
    templateNode({
      id: "ci-test",
      label: "Test",
      shape: "diamond",
      x: 420,
      y: 55,
      theme: "amber",
    }),
    templateNode({
      id: "ci-staging",
      label: "Staging",
      shape: "hexagon",
      x: 650,
      y: 70,
      theme: "violet",
    }),
    templateNode({
      id: "ci-prod",
      label: "Production",
      shape: "circle",
      x: 880,
      y: 75,
      theme: "green",
    }),
  ],
  edges: [
    templateEdge({
      id: "ci-e1",
      source: "ci-repo",
      target: "ci-build",
      sourceHandle: "right",
      targetHandle: "left",
      label: "push",
    }),
    templateEdge({
      id: "ci-e2",
      source: "ci-build",
      target: "ci-test",
      sourceHandle: "right",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ci-e3",
      source: "ci-test",
      target: "ci-staging",
      sourceHandle: "right",
      targetHandle: "left",
      label: "pass",
    }),
    templateEdge({
      id: "ci-e4",
      source: "ci-staging",
      target: "ci-prod",
      sourceHandle: "right",
      targetHandle: "left",
      label: "promote",
    }),
  ],
}

const eventDriven: CanvasTemplate = {
  id: "event-driven",
  name: "Event-driven System",
  description:
    "Producers publish to an event bus that fans out to consumers and a store.",
  nodes: [
    templateNode({
      id: "ed-producer-a",
      label: "Producer A",
      shape: "rectangle",
      x: 0,
      y: 40,
      theme: "blue",
    }),
    templateNode({
      id: "ed-producer-b",
      label: "Producer B",
      shape: "rectangle",
      x: 0,
      y: 200,
      theme: "teal",
    }),
    templateNode({
      id: "ed-bus",
      label: "Event Bus",
      shape: "hexagon",
      x: 250,
      y: 110,
      theme: "violet",
      width: 150,
      height: 120,
    }),
    templateNode({
      id: "ed-consumer-a",
      label: "Consumer A",
      shape: "pill",
      x: 520,
      y: 0,
      theme: "green",
    }),
    templateNode({
      id: "ed-consumer-b",
      label: "Consumer B",
      shape: "pill",
      x: 520,
      y: 140,
      theme: "amber",
    }),
    templateNode({
      id: "ed-store",
      label: "Event Store",
      shape: "cylinder",
      x: 250,
      y: 300,
      theme: "muted",
    }),
  ],
  edges: [
    templateEdge({
      id: "ed-e1",
      source: "ed-producer-a",
      target: "ed-bus",
      sourceHandle: "right",
      targetHandle: "left",
      label: "publish",
    }),
    templateEdge({
      id: "ed-e2",
      source: "ed-producer-b",
      target: "ed-bus",
      sourceHandle: "right",
      targetHandle: "left",
      label: "publish",
    }),
    templateEdge({
      id: "ed-e3",
      source: "ed-bus",
      target: "ed-consumer-a",
      sourceHandle: "right",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ed-e4",
      source: "ed-bus",
      target: "ed-consumer-b",
      sourceHandle: "right",
      targetHandle: "left",
    }),
    templateEdge({
      id: "ed-e5",
      source: "ed-bus",
      target: "ed-store",
      sourceHandle: "bottom",
      targetHandle: "top",
      label: "persist",
    }),
  ],
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  microservices,
  cicdPipeline,
  eventDriven,
]
