import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
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

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  await auth.protect();

  const ownedProjects = userId ? await loadOwnedProjects(userId) : [];

  return (
    <EditorShell ownedProjects={ownedProjects}>{children}</EditorShell>
  );
}
