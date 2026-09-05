import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { appNav } from "@/config/product";
import { listLeads } from "@/lib/relay/workspace.functions";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";
  root.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("relay-theme", next);
  } catch {
    /* stockage indisponible : le thème reste local à la session */
  }
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const fetchLeads = useServerFn(listLeads);

  const leads = useQuery({
    queryKey: ["leads", "all"],
    queryFn: () => fetchLeads({ data: { status: "all" } }),
    enabled: open,
    staleTime: 60_000,
  });

  const run = useCallback(
    (action: () => void) => {
      onOpenChange(false);
      action();
    },
    [onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Commandes Relay">
      <CommandInput placeholder="Rechercher une page ou une demande (nom, e-mail)…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {appNav.map((item) => (
            <CommandItem
              key={item.to}
              value={`Aller à ${item.label}`}
              onSelect={() => run(() => navigate({ to: item.to }))}
            >
              Aller à {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Demandes">
          {(leads.data ?? []).slice(0, 30).map((lead) => (
            <CommandItem
              key={lead.id}
              value={`${lead.contactName ?? ""} ${lead.email ?? ""} ${lead.intent ?? ""}`}
              onSelect={() =>
                run(() => navigate({ to: "/app/leads/$leadId", params: { leadId: lead.id } }))
              }
            >
              <span className="truncate">
                {lead.contactName ?? lead.email ?? "Contact sans nom"}
              </span>
              <span className="ml-2 truncate text-xs text-muted-foreground">
                {lead.intent ?? ""}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Affichage">
          <CommandItem value="Changer de thème" onSelect={() => run(toggleTheme)}>
            Changer de thème
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Raccourci global Cmd+K / Ctrl+K. */
export function useCommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
