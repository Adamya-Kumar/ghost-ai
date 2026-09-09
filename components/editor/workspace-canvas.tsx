"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
} from "@xyflow/react"
import { Component, type ReactNode } from "react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

import "@xyflow/react/dist/style.css"

type WorkspaceCanvasProps = {
  roomId: string
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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  return (
    <div className="h-full min-h-0 w-full flex-1 bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
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
              <CollaborativeCanvas />
            </ClientSideSuspense>
          </LiveblocksConnectionError>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}
