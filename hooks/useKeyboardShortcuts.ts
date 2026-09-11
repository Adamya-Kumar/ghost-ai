"use client"

import { useEffect } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

const ZOOM_DURATION_MS = 200

type KeyboardShortcutHandlers = {
  undo: () => void
  redo: () => void
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable='true'], [contenteditable='']",
    ),
  )
}

export function useKeyboardShortcuts(
  reactFlow: ReactFlowInstance,
  { undo, redo }: KeyboardShortcutHandlers,
) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return
      }

      const meta = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (meta && key === "z") {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }

      if (meta && key === "y") {
        event.preventDefault()
        redo()
        return
      }

      if (meta || event.altKey) {
        return
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault()
        void reactFlow.zoomIn({ duration: ZOOM_DURATION_MS })
        return
      }

      if (event.key === "-") {
        event.preventDefault()
        void reactFlow.zoomOut({ duration: ZOOM_DURATION_MS })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [reactFlow, redo, undo])
}

export { ZOOM_DURATION_MS }
