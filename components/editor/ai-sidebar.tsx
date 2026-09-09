import { Bot, Sparkles } from "lucide-react"

export function AiSidebar() {
  return (
    <aside className="hidden h-full w-[22rem] shrink-0 flex-col border-l border-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">AI Copilot</h2>
          <p className="mt-1 text-sm text-muted-foreground">Placeholder panel</p>
        </div>
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4">
        <div className="rounded-xl border border-border bg-card/80 p-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
            <Bot className="size-4" aria-hidden />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Chat surface pending
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The toggle is wired. Messaging and generation are intentionally out
            of scope here.
          </p>
        </div>

        <div className="mt-auto rounded-xl border border-border/80 bg-transparent px-4 py-4">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Future hooks
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Prompt composer, run status, and architecture guidance will attach
            to this sidebar.
          </p>
        </div>
      </div>
    </aside>
  )
}
