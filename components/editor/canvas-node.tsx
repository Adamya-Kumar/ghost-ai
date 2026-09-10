"use client"

import { NodeResizer, useReactFlow, type NodeProps } from "@xyflow/react"
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

import { CanvasShapeGraphic } from "@/components/editor/canvas-shape"
import { cn } from "@/lib/utils"
import {
  MIN_NODE_HEIGHT,
  MIN_NODE_WIDTH,
  NODE_LABEL_PLACEHOLDER,
  type CanvasNode,
} from "@/types/canvas"

export function CanvasNodeView({
  id,
  data,
  width,
  height,
  selected,
}: NodeProps<CanvasNode>) {
  const nodeWidth = width ?? 160
  const nodeHeight = height ?? 90
  const { updateNodeData } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditing) {
      return
    }

    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    textarea.focus()
    textarea.select()
  }, [isEditing])

  function closeEditing() {
    setIsEditing(false)
  }

  function onLabelChange(value: string) {
    updateNodeData(id, { label: value })
  }

  function onLabelKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Escape") {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    closeEditing()
  }

  function onLabelPointerDown(event: PointerEvent<HTMLTextAreaElement>) {
    event.stopPropagation()
  }

  return (
    <div className="relative h-full w-full overflow-visible">
      <NodeResizer
        isVisible={Boolean(selected)}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        color="var(--muted-foreground)"
        handleClassName="!size-1.5 !rounded-[2px] !border-muted-foreground/70 !bg-background"
        lineClassName="!border-muted-foreground/30"
      />
      <CanvasShapeGraphic
        shape={data.shape}
        color={data.color}
        width={nodeWidth}
        height={nodeHeight}
      />
      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center px-3 text-center text-sm text-foreground",
          isEditing && "nopan nodrag",
        )}
        onDoubleClick={(event) => {
          event.stopPropagation()
          setIsEditing(true)
        }}
      >
        <span
          className={cn(
            "max-w-full truncate",
            isEditing && "invisible",
            !data.label && "text-muted-foreground",
          )}
        >
          {data.label || NODE_LABEL_PLACEHOLDER}
        </span>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="nodrag nopan nowheel absolute inset-x-3 inset-y-0 z-20 h-full w-[calc(100%-1.5rem)] resize-none overflow-hidden bg-transparent py-0 text-center text-sm leading-5 text-foreground outline-none content-center placeholder:text-muted-foreground"
            value={data.label}
            placeholder={NODE_LABEL_PLACEHOLDER}
            onChange={(event) => onLabelChange(event.target.value)}
            onBlur={closeEditing}
            onKeyDown={onLabelKeyDown}
            onPointerDown={onLabelPointerDown}
          />
        ) : null}
      </div>
    </div>
  )
}
