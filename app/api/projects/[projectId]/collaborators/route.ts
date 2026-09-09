import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { enrichCollaborators, enrichOwner } from "@/lib/enrich-collaborators";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access";

async function getProjectOrError(projectId: string): Promise<
  | { error: NextResponse }
  | {
      identity: NonNullable<Awaited<ReturnType<typeof getCurrentIdentity>>>;
      project: NonNullable<Awaited<ReturnType<typeof getAccessibleProject>>>;
    }
> {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const project = await getAccessibleProject(projectId, identity);

  if (!project) {
    const exists = await prisma.orm.public.Project.first({ id: projectId });
    if (!exists) {
      return {
        error: NextResponse.json({ error: "Not found" }, { status: 404 }),
      };
    }

    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { identity, project };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const result = await getProjectOrError(projectId);

  if ("error" in result) {
    return result.error;
  }

  const { identity, project } = result;
  const rows = await prisma.orm.public.ProjectCollaborator.where((c) =>
    c.projectId.eq(projectId),
  )
    .orderBy((c) => c.createdAt.desc())
    .all();

  const [collaborators, owner] = await Promise.all([
    enrichCollaborators(rows),
    enrichOwner(project.ownerId),
  ]);

  return NextResponse.json({
    isOwner: project.ownerId === identity.userId,
    owner,
    collaborators,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await prisma.orm.public.Project.first({ id: projectId });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { email?: unknown } = {};
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const owner = await enrichOwner(project.ownerId);

  if (owner.email && owner.email === email) {
    return NextResponse.json(
      { error: "Owner already has access" },
      { status: 409 },
    );
  }

  const existing = await prisma.orm.public.ProjectCollaborator.where({
    projectId,
    email,
  }).first();

  if (existing) {
    return NextResponse.json(
      { error: "Collaborator already invited" },
      { status: 409 },
    );
  }

  const collaborator = await prisma.orm.public.ProjectCollaborator.create({
    projectId,
    email,
  });

  const [view] = await enrichCollaborators([collaborator]);

  return NextResponse.json(view, { status: 201 });
}
