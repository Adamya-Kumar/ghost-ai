import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ projectId: string; collaboratorId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, collaboratorId } = await params;
  const project = await prisma.orm.public.Project.first({ id: projectId });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const collaborator = await prisma.orm.public.ProjectCollaborator.first({
    id: collaboratorId,
  });

  if (!collaborator || collaborator.projectId !== projectId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.orm.public.ProjectCollaborator.where({
    id: collaboratorId,
  }).delete();

  return new NextResponse(null, { status: 204 });
}
