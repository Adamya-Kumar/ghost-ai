"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"

import { CanvasShapeGraphic } from "@/components/editor/canvas-shape"
import {
  CANVAS_TEMPLATES,
  type CanvasTemplate,
} from "@/components/editor/starter-templates"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const PREVIEW_WIDTH = 280
const PREVIEW_HEIGHT = 148
const PREVIEW_PADDING = 24

type StarterTemplatesDialogContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StarterTemplatesDialogContext =
  createContext<StarterTemplatesDialogContextValue | null>(null)

export function StarterTemplatesDialogProvider({
  open,
  onOpenChange,
  children,
}: StarterTemplatesDialogContextValue & { children: ReactNode }) {
  return (
    <StarterTemplatesDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </StarterTemplatesDialogContext.Provider>
  )
}

export function useStarterTemplatesDialog() {
  return useContext(StarterTemplatesDialogContext)
}

type StarterTemplatesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (template: CanvasTemplate) => void
}

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  function importTemplate(template: CanvasTemplate) {
    onImport(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden border-border bg-popover p-0 text-popover-foreground sm:max-w-3xl">
        <DialogHeader className="gap-1.5 border-b border-border px-5 py-4 text-left">
          <DialogTitle className="text-[15px] font-semibold">
            Starter templates
          </DialogTitle>
          <DialogDescription>
            Replace the current canvas with a pre-built diagram.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[min(70vh,560px)]">
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {CANVAS_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                size="sm"
                className="border-border bg-card"
              >
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplatePreview template={template} />
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={() => importTemplate(template)}
                  >
                    Import
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const bounds = getPreviewBounds(template)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <svg
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
        className="block h-[148px] w-full"
        aria-hidden
      >
        {template.edges.map((edge) => {
          const source = template.nodes.find((node) => node.id === edge.source)
          const target = template.nodes.find((node) => node.id === edge.target)
          if (!source || !target) {
            return null
          }

          const start = nodeCenter(source)
          const end = nodeCenter(target)

          return (
            <line
              key={edge.id}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
        {template.nodes.map((node) => {
          const width = node.width ?? 160
          const height = node.height ?? 90

          return (
            <foreignObject
              key={node.id}
              x={node.position.x}
              y={node.position.y}
              width={width}
              height={height}
            >
              <div className="relative h-full w-full">
                <CanvasShapeGraphic
                  shape={node.data.shape}
                  color={node.data.color}
                  width={width}
                  height={height}
                />
              </div>
            </foreignObject>
          )
        })}
      </svg>
    </div>
  )
}

function nodeCenter(node: CanvasTemplate["nodes"][number]) {
  return {
    x: node.position.x + (node.width ?? 160) / 2,
    y: node.position.y + (node.height ?? 90) / 2,
  }
}

function getPreviewBounds(template: CanvasTemplate) {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const node of template.nodes) {
    const width = node.width ?? 160
    const height = node.height ?? 90
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + width)
    maxY = Math.max(maxY, node.position.y + height)
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return { x: 0, y: 0, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }
  }

  return {
    x: minX - PREVIEW_PADDING,
    y: minY - PREVIEW_PADDING,
    width: Math.max(maxX - minX + PREVIEW_PADDING * 2, 1),
    height: Math.max(maxY - minY + PREVIEW_PADDING * 2, 1),
  }
}
