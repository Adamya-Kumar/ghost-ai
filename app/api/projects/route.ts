import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.orm.public.Project.where((p) =>
    p.ownerId.eq(userId),
  )
    .orderBy((p) => p.createdAt.desc())
    .all();

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: unknown; name?: unknown; description?: unknown } = {};
  try {
    body = (await request.json()) as {
      id?: unknown;
      name?: unknown;
      description?: unknown;
    };
  } catch {
    // Empty or non-JSON body is fine; name defaults below.
  }

  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : DEFAULT_PROJECT_NAME;

  const description =
    typeof body.description === "string" ? body.description : undefined;

  // Optional client-provided id keeps project id aligned with Liveblocks room id.
  const id =
    typeof body.id === "string" && body.id.trim().length > 0
      ? body.id.trim()
      : undefined;

  const project = await prisma.orm.public.Project.create({
    ...(id ? { id } : {}),
    ownerId: userId,
    name,
    ...(description !== undefined ? { description } : {}),
  });

  return NextResponse.json(project, { status: 201 });
}
