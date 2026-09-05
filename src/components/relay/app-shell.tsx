import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import { CommandMenu, useCommandMenu } from "@/components/relay/command-menu";
import { Button } from "@/components/ui/button";
import { appNav, product } from "@/config/product";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  title: string;
  description?: string;
  organizationName?: string | null;
  actions?: ReactNode;
  children: ReactNode;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Navigation de l’espace" className="flex flex-col gap-1">
      {appNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={cn(
            "flex min-h-11 items-center rounded-lg px-3 text-sm text-background/65 transition-colors hover:bg-background/10 hover:text-background",
          )}
          activeProps={{ className: "bg-background/12 text-background" }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  organizationName,
  actions,
  children,
}: AppShellProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: commandOpen, setOpen: setCommandOpen } = useCommandMenu();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const sidebarBody = (
    <>
      <Link to="/" className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-signal" aria-hidden="true" />
        <span className="text-lg font-semibold text-background">{product.name}</span>
      </Link>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
        Organisation
      </p>
      <p className="mt-1 truncate text-sm text-background">
        {organizationName ?? "Non configurée"}
      </p>

      <div className="mt-8">
        <NavLinks onNavigate={() => setMenuOpen(false)} />
      </div>

      <div className="mt-8 space-y-2 border-t border-background/15 pt-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full border-background/25 bg-transparent text-background hover:bg-background/10"
        >
          <Link to="/e/$slug" params={{ slug: "geolia-demo" }} onClick={() => setMenuOpen(false)}>
            Voir l’expérience publiée
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-background/70 hover:bg-background/10 hover:text-background"
          onClick={signOut}
        >
          Se déconnecter
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="hidden w-[248px] shrink-0 flex-col bg-ink px-5 py-6 lg:flex">
        {sidebarBody}
      </aside>

      <div className="border-b border-border bg-ink px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
            <span className="text-base font-semibold text-background">{product.name}</span>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="app-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-background/25 text-background"
          >
            <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span aria-hidden="true">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
        {menuOpen ? (
          <div id="app-menu" className="mt-4">
            {sidebarBody}
          </div>
        ) : null}
      </div>

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            {organizationName ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {organizationName}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
