"use client"

import { useCallback, useMemo, useState, type SubmitEvent } from "react"

import type { MockProject } from "@/lib/mock-projects"
import {
  isValidProjectSlug,
  sanitizeProjectName,
  toProjectSlug,
} from "@/lib/project-slug"

export type ProjectDialog = "create" | "rename" | "delete" | null

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<ProjectDialog>(null)
  const [activeProject, setActiveProject] = useState<MockProject | null>(null)
  const [createName, setCreateNameState] = useState("")
  const [renameName, setRenameNameState] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = useMemo(() => toProjectSlug(createName), [createName])
  const isCreateSlugValid = isValidProjectSlug(createSlug)

  const closeDialog = useCallback(() => {
    if (isLoading) {
      return
    }

    setDialog(null)
    setActiveProject(null)
  }, [isLoading])

  const openCreate = useCallback(() => {
    setCreateNameState("")
    setActiveProject(null)
    setDialog("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setActiveProject(project)
    setRenameNameState(sanitizeProjectName(project.name))
    setDialog("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setActiveProject(project)
    setDialog("delete")
  }, [])

  const setCreateName = useCallback((value: string) => {
    setCreateNameState(sanitizeProjectName(value))
  }, [])

  const setRenameName = useCallback((value: string) => {
    setRenameNameState(sanitizeProjectName(value))
  }, [])

  const submitCreate = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isCreateSlugValid || isLoading) {
        return
      }

      setIsLoading(true)
      setIsLoading(false)
      setDialog(null)
      setCreateNameState("")
    },
    [isCreateSlugValid, isLoading]
  )

  const submitRename = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isValidProjectSlug(toProjectSlug(renameName)) || !activeProject || isLoading) {
        return
      }

      setIsLoading(true)
      setIsLoading(false)
      setDialog(null)
      setActiveProject(null)
    },
    [activeProject, isLoading, renameName]
  )

  const confirmDelete = useCallback(() => {
    if (!activeProject || isLoading) {
      return
    }

    setIsLoading(true)
    setIsLoading(false)
    setDialog(null)
    setActiveProject(null)
  }, [activeProject, isLoading])

  return {
    dialog,
    activeProject,
    createName,
    createSlug,
    isCreateSlugValid,
    renameName,
    isLoading,
    setCreateName,
    setRenameName,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    confirmDelete,
  }
}

export type ProjectDialogsState = ReturnType<typeof useProjectDialogs>
