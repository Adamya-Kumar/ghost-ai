"use client"

import { useCallback, useMemo, useState, type FormEvent } from "react"

import type { MockProject } from "@/lib/mock-projects"

export type ProjectDialog = "create" | "rename" | "delete" | null

export function toProjectSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<ProjectDialog>(null)
  const [activeProject, setActiveProject] = useState<MockProject | null>(null)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = useMemo(() => toProjectSlug(createName), [createName])

  const closeDialog = useCallback(() => {
    if (isLoading) {
      return
    }

    setDialog(null)
    setActiveProject(null)
  }, [isLoading])

  const openCreate = useCallback(() => {
    setCreateName("")
    setActiveProject(null)
    setDialog("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setActiveProject(project)
    setRenameName(project.name)
    setDialog("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setActiveProject(project)
    setDialog("delete")
  }, [])

  const submitCreate = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!createName.trim() || isLoading) {
        return
      }

      setIsLoading(true)
      setIsLoading(false)
      setDialog(null)
      setCreateName("")
    },
    [createName, isLoading]
  )

  const submitRename = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!renameName.trim() || !activeProject || isLoading) {
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
