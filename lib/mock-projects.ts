export type MockProject = {
  id: string
  name: string
  slug: string
}

export const mockOwnedProjects: MockProject[] = [
  { id: "owned-1", name: "Payment Gateway", slug: "payment-gateway" },
  { id: "owned-2", name: "Auth Service", slug: "auth-service" },
]

export const mockSharedProjects: MockProject[] = [
  { id: "shared-1", name: "Design System", slug: "design-system" },
]
