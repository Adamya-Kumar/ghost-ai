import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-border bg-card px-10 py-12 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
          <Lock className="size-5 text-foreground" strokeWidth={1.75} aria-hidden />
        </div>
        <h1 className="mt-6 text-[1.35rem] font-semibold leading-snug tracking-tight text-foreground">
          You don&apos;t have access to this workspace.
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Head back to your editor home to open a project you can access.
        </p>
        <Button type="button" size="lg" className="mt-8 h-9 px-4 font-medium" asChild>
          <Link href="/editor">Back to Editor</Link>
        </Button>
      </div>
    </div>
  );
}
