import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { cursorColorFromUserId, getLiveblocks } from "@/lib/liveblocks";
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access";

function displayName(
  fullName: string | null | undefined,
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  username: string | null | undefined,
  fallback: string,
) {
  if (fullName && fullName.trim().length > 0) {
    return fullName.trim();
  }

  const combined = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (combined.length > 0) {
    return combined;
  }

  if (username && username.trim().length > 0) {
    return username.trim();
  }

  return fallback;
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { room?: unknown } = {};
  try {
    body = (await request.json()) as { room?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.room !== "string" || body.room.length === 0) {
    return NextResponse.json({ error: "Room is required" }, { status: 400 });
  }

  const projectId = body.room;
  const project = await getAccessibleProject(projectId, identity);

  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const liveblocks = getLiveblocks();

  await liveblocks.getOrCreateRoom(projectId, {
    defaultAccesses: [],
  });

  let name = identity.email ?? "Anonymous";
  let avatar = "";

  try {
    const user = await currentUser();
    name = displayName(
      user?.fullName,
      user?.firstName,
      user?.lastName,
      user?.username,
      name,
    );
    avatar = user?.imageUrl ?? "";
  } catch {
    // Keep identity fallbacks when Clerk Backend is unavailable.
  }

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name,
      avatar,
      color: cursorColorFromUserId(identity.userId),
    },
  });

  session.allow(projectId, ["*:write"]);

  const { status, body: tokenBody } = await session.authorize();
  return new Response(tokenBody, { status });
}
