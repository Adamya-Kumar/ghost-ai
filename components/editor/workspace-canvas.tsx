import { DraftingCompass } from "lucide-react"

export function WorkspaceCanvas() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden bg-background px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklch, var(--border) 55%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--border) 55%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 35%, transparent 78%)",
        }}
      />

      <div className="relative z-10 flex max-w-[34rem] flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-[1.25rem] border border-primary/25 bg-primary/10 text-primary shadow-[0_0_48px_color-mix(in_oklch,var(--primary)_22%,transparent)]">
          <DraftingCompass className="size-7" aria-hidden />
        </div>

        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Workspace shell
        </p>

        <h1 className="mt-4 font-heading text-[2rem] leading-tight font-semibold tracking-tight text-foreground sm:text-[2.35rem]">
          Canvas and collaboration tooling land here next.
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          This room is ready for the shared architecture canvas, durable AI
          workflows, and real-time presence. For now, the shell is wired with
          project context and navigation only.
        </p>
      </div>
    </div>
  )
}
