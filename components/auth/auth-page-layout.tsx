import type { ReactNode } from "react";
import { BrainCircuit, ScrollText, Share2 } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: ScrollText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

type AuthPageLayoutProps = {
  children: ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="flex h-dvh min-h-dvh w-full items-stretch font-sans">
      <aside className="hidden h-full w-1/2 flex-col justify-between border-r border-border bg-secondary px-12 py-10 lg:flex xl:px-16">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold leading-none text-primary-foreground"
          >
            G
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Ghost AI
          </span>
        </div>

        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground">
              Design systems at the speed of thought.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-5">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                  <feature.icon
                    aria-hidden
                    className="size-5 text-primary"
                    strokeWidth={1.75}
                  />
                </span>
                <div className="space-y-1">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex h-full w-full items-center justify-center bg-background px-4 py-8 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}
