"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "@liveblocks/react/suspense"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type DefaultEdgeOptions,
} from "@xyflow/react"
import { Component, useRef, type DragEvent, type ReactNode } from "react"

import { CanvasControlBar } from "@/components/editor/canvas-control-bar"
import { CanvasEdgeView } from "@/components/editor/canvas-edge"
import { CanvasNodeView } from "@/components/editor/canvas-node"
import { ShapePanel } from "@/components/editor/shape-panel"
import {
  useKeyboardShortcuts,
  ZOOM_DURATION_MS,
} from "@/hooks/useKeyboardShortcuts"
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  DEFAULT_SHAPE_SIZES,
  parseShapeDragPayload,
  SHAPE_DRAG_MIME,
  type CanvasEdge,
  type CanvasNode,
  type CanvasShape,
} from "@/types/canvas"

import "@xyflow/react/dist/style.css"

type WorkspaceCanvasProps = {
  roomId: string
}

const nodeTypes = {
  canvasNode: CanvasNodeView,
}

const edgeTypes = {
  canvasEdge: CanvasEdgeView,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "canvasEdge",
  data: { label: "" },
  style: {
    strokeLinecap: "round",
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: "var(--muted-foreground)",
  },
}

let nodeIdCounter = 0

function createNodeId(shape: CanvasShape) {
  nodeIdCounter += 1
  return `${shape}-${Date.now()}-${nodeIdCounter}`
}

function CanvasStatus({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

class LiveblocksConnectionError extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <CanvasStatus message="Could not connect to the live canvas. Refresh to try again." />
      )
    }

    return this.props.children
  }
}

function CollaborativeCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reactFlow = useReactFlow()
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = reactFlow
  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  useKeyboardShortcuts(reactFlow, { undo, redo })

  const canvasEdges = edges.map((edge) => ({
    ...edge,
    type: "canvasEdge" as const,
    markerEnd: edge.markerEnd ?? defaultEdgeOptions.markerEnd,
    data: { label: edge.data?.label ?? "" },
  }))

  function addShapeNode(
    shape: CanvasShape,
    size: { width: number; height: number },
    position: { x: number; y: number },
  ) {
    const newNode: CanvasNode = {
      id: createNodeId(shape),
      type: "canvasNode",
      position,
      width: size.width,
      height: size.height,
      style: { width: size.width, height: size.height },
      data: {
        label: "",
        color: DEFAULT_NODE_COLOR,
        textColor: DEFAULT_NODE_TEXT_COLOR,
        shape,
      },
    }

    onNodesChange([{ type: "add", item: newNode }])
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()

    const payload = parseShapeDragPayload(
      event.dataTransfer.getData(SHAPE_DRAG_MIME),
    )
    if (!payload) {
      return
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    addShapeNode(
      payload.shape,
      { width: payload.width, height: payload.height },
      position,
    )
  }

  function onAddShape(shape: CanvasShape) {
    const bounds = wrapperRef.current?.getBoundingClientRect()
    if (!bounds) {
      return
    }

    const size = DEFAULT_SHAPE_SIZES[shape]
    const position = screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    })

    addShapeNode(shape, size, {
      x: position.x - size.width / 2,
      y: position.y - size.height / 2,
    })
  }

  return (
    <div
      ref={wrapperRef}
      className="relative h-full min-h-0 w-full flex-1 bg-background"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={canvasEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
      <CanvasControlBar
        onZoomOut={() => {
          void zoomOut({ duration: ZOOM_DURATION_MS })
        }}
        onFitView={() => {
          void fitView({ duration: ZOOM_DURATION_MS })
        }}
        onZoomIn={() => {
          void zoomIn({ duration: ZOOM_DURATION_MS })
        }}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <ShapePanel onAddShape={onAddShape} />
    </div>
  )
}

export function WorkspaceCanvas({ roomId }: WorkspaceCanvasProps) {
  return (
    <div className="h-full min-h-0 min-w-0 flex-1">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <LiveblocksConnectionError>
            <ClientSideSuspense
              fallback={<CanvasStatus message="Loading canvas…" />}
            >
              <ReactFlowProvider>
                <CollaborativeCanvas />
              </ReactFlowProvider>
            </ClientSideSuspense>
          </LiveblocksConnectionError>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}
