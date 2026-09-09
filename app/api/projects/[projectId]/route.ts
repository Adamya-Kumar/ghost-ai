import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

async function getOwnedProject(projectId: string, userId: string) {
  const project = await prisma.orm.public.Project.first({ id: projectId });

  if (!project) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  if (project.ownerId !== userId) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { project };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const owned = await getOwnedProject(projectId, userId);
  if ("error" in owned && owned.error) {
    return owned.error;
  }

  let body: { name?: unknown } = {};
  try {
    body = (await request.json()) as { name?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const name = body.name.trim();

  const updated = await prisma.orm.public.Project.where({
    id: projectId,
  }).update({
    name,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const owned = await getOwnedProject(projectId, userId);
  if ("error" in owned && owned.error) {
    return owned.error;
  }

  await prisma.orm.public.Project.where({ id: projectId }).delete();

  return new NextResponse(null, { status: 204 });
}
