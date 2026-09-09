import { auth, currentUser } from "@clerk/nextjs/server";

import { normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import type { ProjectSummary } from "@/lib/projects";

export type ClerkIdentity = {
  userId: string;
  email: string | null;
};

function emailFromClaims(sessionClaims: unknown): string | null {
  if (!sessionClaims || typeof sessionClaims !== "object") {
    return null;
  }

  const claims = sessionClaims as Record<string, unknown>;
  const direct = claims.email;
  if (typeof direct === "string" && direct.length > 0) {
    return normalizeEmail(direct);
  }

  const primary = claims.primary_email_address;
  if (typeof primary === "string" && primary.length > 0) {
    return normalizeEmail(primary);
  }

  return null;
}

export async function getCurrentIdentity(): Promise<ClerkIdentity | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await currentUser();
    const rawEmail =
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      null;

    return {
      userId,
      email: rawEmail ? normalizeEmail(rawEmail) : emailFromClaims(sessionClaims),
    };
  } catch {
    // Clerk Backend can fail transiently (network / accountless instance).
    // Keep the session usable for owners via userId; email may be null.
    return {
      userId,
      email: emailFromClaims(sessionClaims),
    };
  }
}

export async function getAccessibleProject(
  projectId: string,
  identity: ClerkIdentity,
): Promise<ProjectSummary | null> {
  const project = await prisma.orm.public.Project.first({ id: projectId });

  if (!project) {
    return null;
  }

  if (project.ownerId === identity.userId) {
    return project as ProjectSummary;
  }

  if (!identity.email) {
    return null;
  }

  const collaborator = await prisma.orm.public.ProjectCollaborator.where({
    projectId,
    email: normalizeEmail(identity.email),
  }).first();

  if (!collaborator) {
    return null;
  }

  return project as ProjectSummary;
}

export async function canAccessProject(
  projectId: string,
  identity: ClerkIdentity,
): Promise<boolean> {
  const project = await getAccessibleProject(projectId, identity);
  return project !== null;
}
