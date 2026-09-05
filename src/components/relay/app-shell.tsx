import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

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

export function AppShell({
  title,
  description,
  organizationName,
  actions,
  children,
}: AppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-base font-semibold text-foreground">
            {product.name}
          </Link>
          <nav aria-label="Navigation principale" className="flex flex-wrap gap-1">
            {appNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                )}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            {organizationName ? (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {organizationName}
              </p>
            ) : null}
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
