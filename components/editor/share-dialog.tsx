"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, Link2, Mail, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CollaboratorView, CollaboratorsResponse } from "@/lib/collaborators";
import { isValidEmail } from "@/lib/email";
import { cn } from "@/lib/utils";

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
};

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [owner, setOwner] = useState<CollaboratorView | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorView[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollaborators = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);

      if (!response.ok) {
        setError("Could not load people with access.");
        return;
      }

      const data = (await response.json()) as CollaboratorsResponse;
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setCopied(false);
      setError(null);
      return;
    }

    void loadCollaborators();
  }, [loadCollaborators, open]);

  const peopleCount = (owner ? 1 : 0) + collaborators.length;

  async function inviteCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isOwner || isSaving || !isValidEmail(email)) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Could not invite collaborator.");
        return;
      }

      const collaborator = (await response.json()) as CollaboratorView;
      setCollaborators((current) => [collaborator, ...current]);
      setEmail("");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    if (!isOwner || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        setError("Could not remove collaborator.");
        return;
      }

      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function copyProjectLink() {
    if (!isOwner) {
      return;
    }

    const url = `${window.location.origin}/editor/${projectId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden border-border bg-popover p-0 text-popover-foreground sm:max-w-lg">
        <DialogHeader className="gap-1.5 border-b border-border px-5 py-4 text-left">
          <DialogTitle className="text-[15px] font-semibold">
            Share project
          </DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators, copy the workspace link, and manage access."
              : "People with access to this workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 px-5 py-4">
          {isOwner ? (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border px-3.5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">Workspace link</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Share a direct link with teammates after you grant them
                  access.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 border-border bg-transparent"
                onClick={() => void copyProjectLink()}
              >
                {copied ? (
                  <Check data-icon="inline-start" className="size-3.5" />
                ) : (
                  <Link2 data-icon="inline-start" className="size-3.5" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          ) : null}

          {isOwner ? (
            <form
              className="flex items-center gap-2 rounded-xl border border-border p-2"
              onSubmit={inviteCollaborator}
            >
              <div className="relative min-w-0 flex-1">
                <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@company.com"
                  autoComplete="off"
                  disabled={isSaving}
                  className="border-0 bg-transparent pl-8 shadow-none dark:bg-transparent"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving || !isValidEmail(email)}
              >
                Invite
              </Button>
            </form>
          ) : null}

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">People with access</p>
              <p className="text-xs text-muted-foreground">
                {peopleCount} total
              </p>
            </div>

            <ScrollArea className="max-h-64">
              {isLoading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading…
                </p>
              ) : (
                <ul className="grid gap-2">
                  {owner ? (
                    <PersonRow person={owner} role="owner" />
                  ) : null}
                  {collaborators.map((collaborator) => (
                    <PersonRow
                      key={collaborator.id}
                      person={collaborator}
                      role="collaborator"
                      onRemove={
                        isOwner
                          ? () => void removeCollaborator(collaborator.id)
                          : undefined
                      }
                      removeDisabled={isSaving}
                    />
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PersonRow({
  person,
  role,
  onRemove,
  removeDisabled,
}: {
  person: CollaboratorView;
  role: "owner" | "collaborator";
  onRemove?: () => void;
  removeDisabled?: boolean;
}) {
  const title = person.name ?? (person.email || "Unknown");
  const subtitle = person.email || null;

  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-2.5">
      <PersonAvatar person={person} />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      <span
        className={cn(
          "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
          role === "owner"
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border bg-muted text-muted-foreground",
        )}
      >
        {role === "owner" ? "Owner" : "Collaborator"}
      </span>
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Remove ${person.email}`}
          disabled={removeDisabled}
          onClick={onRemove}
        >
          <Trash2 className="size-3.5" />
        </Button>
      ) : null}
    </li>
  );
}

function PersonAvatar({ person }: { person: CollaboratorView }) {
  if (person.imageUrl) {
    return (
      // Clerk-hosted avatars; next/image is not configured for that host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={person.imageUrl}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  const label = (person.name ?? person.email).slice(0, 1).toUpperCase();

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      {label ? (
        <span className="text-xs font-medium">{label}</span>
      ) : (
        <UserRound className="size-3.5" aria-hidden />
      )}
    </div>
  );
}
