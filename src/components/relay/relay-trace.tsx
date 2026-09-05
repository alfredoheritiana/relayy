import { cn } from "@/lib/utils";

/**
 * Relay Trace — motif propriétaire.
 * HEARD : intention reçue · UNDERSTOOD : faits structurés
 * MISSING : clarification nécessaire · READY : action préparée
 */
export type RelayTraceState = "heard" | "understood" | "missing" | "ready";

export const relayTraceOrder: readonly RelayTraceState[] = [
  "heard",
  "understood",
  "missing",
  "ready",
];

export const relayTraceLabels: Record<RelayTraceState, string> = {
  heard: "HEARD",
  understood: "UNDERSTOOD",
  missing: "MISSING",
  ready: "READY",
};

export const relayTraceCaptions: Record<RelayTraceState, string> = {
  heard: "Intention reçue",
  understood: "Faits structurés",
  missing: "Clarification nécessaire",
  ready: "Action préparée",
};

export interface RelayTraceStep {
  readonly state: RelayTraceState;
  /** Libellé court affiché sous le nœud (par défaut le libellé sémantique). */
  readonly label?: string;
}

export interface RelayTraceProps {
  /** Étapes affichées ; par défaut les quatre états sémantiques. */
  steps?: readonly RelayTraceStep[];
  /** Index de l'étape courante (les précédentes sont considérées franchies). */
  current: number;
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
  className?: string;
  /** Annonce lecteur d'écran de l'état courant. */
  liveLabel?: string;
  onSelect?: (index: number) => void;
}

const nodeColor: Record<RelayTraceState, string> = {
  heard: "bg-relay-blue",
  understood: "bg-relay-blue",
  missing: "bg-relay-orange",
  ready: "bg-relay-red",
};

export function RelayTrace({
  steps,
  current,
  orientation = "horizontal",
  tone = "light",
  className,
  liveLabel,
  onSelect,
}: RelayTraceProps) {
  const items: readonly RelayTraceStep[] = steps ?? relayTraceOrder.map((state) => ({ state }));
  const isVertical = orientation === "vertical";

  return (
    <div className={cn("w-full", className)}>
      <p className="sr-only" aria-live="polite">
        {liveLabel ??
          `Étape ${Math.min(current + 1, items.length)} sur ${items.length} : ${
            relayTraceCaptions[items[Math.min(current, items.length - 1)]!.state]
          }`}
      </p>
      <ol className={cn("flex w-full min-w-0", isVertical ? "flex-col" : "flex-row items-start")}>
        {items.map((item, index) => {
          const done = index < current;
          const active = index === current;
          const label = item.label ?? relayTraceLabels[item.state];
          const content = (
            <>
              <span
                className={cn(
                  "flex items-center",
                  isVertical ? "flex-col self-stretch" : "w-full flex-row",
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "block shrink-0 rounded-full transition-all duration-200",
                    active ? "size-3" : done ? "size-2.5" : "size-2",
                    active || done
                      ? nodeColor[item.state]
                      : tone === "dark"
                        ? "bg-relay-line-dark"
                        : "bg-border",
                    active && "ring-4 ring-current/15",
                  )}
                />
                {index < items.length - 1 ? (
                  <span
                    className={cn(
                      "block transition-colors duration-200",
                      isVertical ? "min-h-10 w-px flex-1" : "h-px flex-1",
                      done
                        ? "bg-relay-blue/70"
                        : tone === "dark"
                          ? "bg-relay-line-dark"
                          : "bg-border",
                    )}
                  />
                ) : null}
              </span>
              <span
                className={cn(
                  "relay-label block truncate pt-2 transition-colors",
                  isVertical && "pb-6",
                  active || done
                    ? tone === "dark"
                      ? "text-relay-white"
                      : "text-foreground"
                    : tone === "dark"
                      ? "text-relay-muted-dark"
                      : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </>
          );

          return (
            <li
              key={`${item.state}-${index}`}
              className={cn(
                "flex min-w-0",
                isVertical ? "flex-row items-start gap-3" : "flex-1 flex-col",
              )}
            >
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 w-full min-w-0 text-left",
                    isVertical ? "flex-row items-start gap-3" : "flex-col",
                  )}
                >
                  <span className="sr-only">{`${label} — ${relayTraceCaptions[item.state]}`}</span>
                  {content}
                </button>
              ) : (
                <span
                  className={cn(
                    "flex w-full min-w-0",
                    isVertical ? "flex-row items-start gap-3" : "flex-col",
                  )}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
