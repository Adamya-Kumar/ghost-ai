"use client"

import { useRouter } from "next/navigation"
import {
  useCallback,
  useMemo,
  useState,
  type SubmitEvent,
} from "react"

import type { ProjectSummary } from "@/lib/projects"
import {
  generateRoomSuffix,
  isValidProjectSlug,
  sanitizeProjectName,
  toProjectSlug,
  toRoomId,
} from "@/lib/project-slug"

export type ProjectDialog = "create" | "rename" | "delete" | null

export type ProjectActionTarget = Pick<ProjectSummary, "id" | "name">

type UseProjectActionsOptions = {
  activeProjectId?: string | null
}

export function useProjectActions({
  activeProjectId = null,
}: UseProjectActionsOptions = {}) {
  const router = useRouter()
  const [dialog, setDialog] = useState<ProjectDialog>(null)
  const [activeProject, setActiveProject] =
    useState<ProjectActionTarget | null>(null)
  const [createName, setCreateNameState] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const [renameName, setRenameNameState] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = useMemo(() => toProjectSlug(createName), [createName])
  const createRoomId = useMemo(
    () => toRoomId(createName, createSuffix),
    [createName, createSuffix],
  )
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
    setCreateSuffix(generateRoomSuffix())
    setActiveProject(null)
    setDialog("create")
  }, [])

  const openRename = useCallback((project: ProjectActionTarget) => {
    setActiveProject(project)
    setRenameNameState(sanitizeProjectName(project.name))
    setDialog("rename")
  }, [])

  const openDelete = useCallback((project: ProjectActionTarget) => {
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
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!isCreateSlugValid || !createRoomId || isLoading) {
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: createRoomId,
            name: createName.trim(),
          }),
        })

        if (!response.ok) {
          return
        }

        const project = (await response.json()) as ProjectSummary
        setDialog(null)
        setCreateNameState("")
        setCreateSuffix("")
        router.push(`/editor/${project.id}`)
        router.refresh()
      } finally {
        setIsLoading(false)
      }
    },
    [createName, createRoomId, isCreateSlugValid, isLoading, router],
  )

  const submitRename = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (
        !isValidProjectSlug(toProjectSlug(renameName)) ||
        !activeProject ||
        isLoading
      ) {
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/projects/${activeProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: renameName.trim() }),
        })

        if (!response.ok) {
          return
        }

        setDialog(null)
        setActiveProject(null)
        router.refresh()
      } finally {
        setIsLoading(false)
      }
    },
    [activeProject, isLoading, renameName, router],
  )

  const confirmDelete = useCallback(async () => {
    if (!activeProject || isLoading) {
      return
    }

    const deletingActive = activeProjectId === activeProject.id

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        return
      }

      setDialog(null)
      setActiveProject(null)

      if (deletingActive) {
        router.push("/editor")
      }
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }, [activeProject, activeProjectId, isLoading, router])

  return {
    dialog,
    activeProject,
    createName,
    createSlug,
    createRoomId,
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

export type ProjectActionsState = ReturnType<typeof useProjectActions>
