export type ProjectSummary = {
  id: string
  name: string
  description: string | null
  status: "DRAFT" | "ARCHIVED"
  canvasJsonPath: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}
