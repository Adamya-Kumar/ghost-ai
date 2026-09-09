import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type WorkspacePageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth();
  const { projectId } = await params;

  if (!userId) {
    notFound();
  }

  const project = await prisma.orm.public.Project.first({ id: projectId });

  if (!project || project.ownerId !== userId) {
    notFound();
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col px-6 py-8">
      <h1 className="font-heading text-2xl font-medium tracking-tight">
        {project.name}
      </h1>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {project.id}
      </p>
    </div>
  );
}
