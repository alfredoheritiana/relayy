import { cn } from "@/lib/utils";

export type SignalNodeState = "idle" | "active" | "done";

export interface SignalNode {
  readonly key: string;
  readonly label: string;
  readonly state: SignalNodeState;
}

export const defaultSignalNodes: readonly string[] = [
  "Intention",
  "Contexte",
  "Qualification",
  "Action",
];

export interface SignalPathProps {
  nodes: readonly SignalNode[];
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
  className?: string;
  /** Texte annoncé aux lecteurs d'écran. */
  liveLabel?: string;
}

/**
 * Signal Path : la représentation propriétaire de la compréhension de Relay.
 * Chaque nœud s'active quand une information est réellement comprise.
 */
export function SignalPath({
  nodes,
  orientation = "horizontal",
  tone = "light",
  className,
  liveLabel,
}: SignalPathProps) {
  const isVertical = orientation === "vertical";

  return (
    <div className={cn("w-full", className)}>
      {liveLabel ? (
        <p className="sr-only" aria-live="polite">
          {liveLabel}
        </p>
      ) : null}
      <ol
        aria-hidden="true"
        className={cn("flex", isVertical ? "flex-col gap-0" : "flex-row items-center gap-0")}
      >
        {nodes.map((node, index) => (
          <li
            key={node.key}
            className={cn(
              "flex min-w-0",
              isVertical ? "flex-row items-start gap-3" : "flex-1 flex-col gap-2",
            )}
          >
            <div
              className={cn(
                "flex items-center",
                isVertical ? "flex-col self-stretch pt-1" : "w-full flex-row",
              )}
            >
              <span
                className={cn(
                  "relative block shrink-0 rounded-full transition-all duration-300",
                  node.state === "idle" && "size-2 bg-transparent ring-1",
                  node.state === "active" && "size-3",
                  node.state === "done" && "size-2.5",
                  tone === "dark"
                    ? node.state === "idle"
                      ? "ring-background/35"
                      : node.state === "active"
                        ? "bg-signal shadow-[0_0_0_4px_color-mix(in_oklab,var(--signal)_22%,transparent)]"
                        : "bg-signal"
                    : node.state === "idle"
                      ? "ring-border"
                      : node.state === "active"
                        ? "bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_16%,transparent)]"
                        : "bg-primary",
                )}
              />
              {index < nodes.length - 1 ? (
                <span
                  className={cn(
                    "block transition-colors duration-300",
                    isVertical ? "min-h-8 w-px flex-1" : "h-px flex-1",
                    node.state === "done"
                      ? tone === "dark"
                        ? "bg-signal/70"
                        : "bg-primary/60"
                      : tone === "dark"
                        ? "bg-background/20"
                        : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "truncate font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                isVertical ? "pb-6" : "",
                node.state === "idle"
                  ? tone === "dark"
                    ? "text-background/45"
                    : "text-muted-foreground"
                  : tone === "dark"
                    ? "text-background"
                    : "text-foreground",
              )}
            >
              {node.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Construit les nœuds à partir d'un index d'étape courante. */
export function nodesFromIndex(labels: readonly string[], currentIndex: number): SignalNode[] {
  return labels.map((label, index) => ({
    key: `${index}-${label}`,
    label,
    state: index < currentIndex ? "done" : index === currentIndex ? "active" : "idle",
  }));
}
