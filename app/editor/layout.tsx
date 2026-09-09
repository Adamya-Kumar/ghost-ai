import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
import { getCurrentIdentity } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import type { ProjectSummary } from "@/lib/projects";

async function loadOwnedProjects(userId: string): Promise<ProjectSummary[]> {
  const projects = await prisma.orm.public.Project.where((p) =>
    p.ownerId.eq(userId),
  )
    .orderBy((p) => p.createdAt.desc())
    .all();

  return projects as ProjectSummary[];
}

async function loadSharedProjects(email: string): Promise<ProjectSummary[]> {
  const collaborations = await prisma.orm.public.ProjectCollaborator.where(
    (c) => c.email.eq(email),
  ).all();

  if (collaborations.length === 0) {
    return [];
  }

  const projectIds = collaborations.map((c) => c.projectId);
  const projects: ProjectSummary[] = [];

  for (const projectId of projectIds) {
    const project = await prisma.orm.public.Project.first({ id: projectId });
    if (project) {
      projects.push(project as ProjectSummary);
    }
  }

  return projects;
}

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  await auth.protect();

  const identity = await getCurrentIdentity();
  const ownedProjects = userId ? await loadOwnedProjects(userId) : [];
  const sharedProjects = identity?.email
    ? await loadSharedProjects(identity.email)
    : [];

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      {children}
    </EditorShell>
  );
}
