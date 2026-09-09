import { clerkClient } from "@clerk/nextjs/server";

import type { CollaboratorView } from "@/lib/collaborators";
import { normalizeEmail } from "@/lib/email";

type CollaboratorRow = {
  id: string;
  email: string;
};

function displayName(
  fullName: string | null,
  firstName: string | null,
  lastName: string | null,
  username: string | null,
) {
  if (fullName && fullName.trim().length > 0) {
    return fullName.trim();
  }

  const combined = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (combined.length > 0) {
    return combined;
  }

  return username;
}

export async function enrichOwner(ownerId: string): Promise<CollaboratorView> {
  const client = await clerkClient();

  try {
    const user = await client.users.getUser(ownerId);
    const rawEmail =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      "";

    return {
      id: ownerId,
      email: rawEmail ? normalizeEmail(rawEmail) : "",
      name: displayName(user.fullName, user.firstName, user.lastName, user.username),
      imageUrl: user.imageUrl || null,
    };
  } catch {
    return {
      id: ownerId,
      email: "",
      name: null,
      imageUrl: null,
    };
  }
}

export async function enrichCollaborators(
  rows: CollaboratorRow[],
): Promise<CollaboratorView[]> {
  if (rows.length === 0) {
    return [];
  }

  const emails = rows.map((row) => normalizeEmail(row.email));
  const byEmail = new Map<string, { name: string | null; imageUrl: string | null }>();

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({
      emailAddress: emails,
      limit: Math.min(emails.length, 100),
    });

    for (const user of users) {
      const name = displayName(
        user.fullName,
        user.firstName,
        user.lastName,
        user.username,
      );
      const profile = {
        name,
        imageUrl: user.imageUrl || null,
      };

      for (const address of user.emailAddresses ?? []) {
        byEmail.set(normalizeEmail(address.emailAddress), profile);
      }
    }
  } catch {
    // Fall back to email-only rows when Clerk enrichment is unavailable.
  }

  return rows.map((row) => {
    const email = normalizeEmail(row.email);
    const profile = byEmail.get(email);

    return {
      id: row.id,
      email,
      name: profile?.name ?? null,
      imageUrl: profile?.imageUrl ?? null,
    };
  });
}
