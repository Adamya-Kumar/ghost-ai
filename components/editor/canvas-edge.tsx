"use client"

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react"
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react"

import { cn } from "@/lib/utils"
import { EDGE_LABEL_HINT, type CanvasEdge } from "@/types/canvas"

const REST_STROKE =
  "color-mix(in oklch, var(--muted-foreground) 55%, transparent)"
const ACTIVE_STROKE = "var(--foreground)"

function stopCanvasGestures(
  event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>,
) {
  event.stopPropagation()
}

export function CanvasEdgeView({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
  markerEnd,
  style,
}: EdgeProps<CanvasEdge>) {
  const { updateEdgeData } = useReactFlow()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const label = data?.label ?? ""

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isActive = Boolean(selected) || isHovered || isEditing
  const stroke = isActive ? ACTIVE_STROKE : REST_STROKE

  useEffect(() => {
    if (!isEditing) {
      return
    }

    const input = inputRef.current
    if (!input) {
      return
    }

    input.focus()
    input.select()
  }, [isEditing])

  function closeEditing() {
    setIsEditing(false)
  }

  function onLabelChange(value: string) {
    updateEdgeData(id, { label: value })
  }

  function onLabelKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== "Escape") {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    closeEditing()
  }

  function startEditing(event: MouseEvent) {
    event.stopPropagation()
    setIsEditing(true)
  }

  const showHint = isActive && !label && !isEditing
  const showPill = Boolean(label) && !isEditing
  const sizingText = isEditing ? label || EDGE_LABEL_HINT : label || EDGE_LABEL_HINT

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      >
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          interactionWidth={24}
          style={{
            ...style,
            stroke,
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </g>
      <EdgeLabelRenderer>
        {isEditing || showPill || showHint ? (
          <div
            className="nodrag nopan nowheel pointer-events-auto absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            onPointerDown={stopCanvasGestures}
            onDoubleClick={startEditing}
          >
            <div
              className={cn(
                "inline-grid max-w-48 rounded-full border px-2 py-0.5 text-center text-[11px] leading-4",
                isEditing || showPill
                  ? "border-border bg-card text-card-foreground"
                  : "border-border/60 bg-card/70 text-muted-foreground",
              )}
            >
              <span
                className="invisible col-start-1 row-start-1 whitespace-pre px-0.5"
                aria-hidden
              >
                {sizingText}
              </span>
              {isEditing ? (
                <input
                  ref={inputRef}
                  className="nodrag nopan nowheel col-start-1 row-start-1 w-full min-w-[2ch] bg-transparent px-0.5 text-center text-[11px] leading-4 outline-none"
                  value={label}
                  placeholder={EDGE_LABEL_HINT}
                  onChange={(event) => onLabelChange(event.target.value)}
                  onBlur={closeEditing}
                  onKeyDown={onLabelKeyDown}
                  onPointerDown={stopCanvasGestures}
                />
              ) : (
                <span className="col-start-1 row-start-1 px-0.5">
                  {label || EDGE_LABEL_HINT}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  )
}
