import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";
import { supabase } from "@/integrations/supabase/client";
import { getWorkspace } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/app/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Votre espace — ${product.name}` },
      { name: "description", content: "Redirection vers votre espace de travail Relay." },
      { property: "og:title", content: `Votre espace — ${product.name}` },
      { property: "og:description", content: "Accès à l’inbox des demandes Relay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppEntryPage,
});

/**
 * Point d'entrée `/app` : aiguille vers l'authentification, l'onboarding
 * ou l'inbox. Aucune 404 ne doit apparaître ici.
 */
function AppEntryPage() {
  const navigate = useNavigate();
  const fetchWorkspace = useServerFn(getWorkspace);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession();
        if (!active) return;
        if (authError) throw authError;
        if (!data.session) {
          window.location.replace("/auth?next=/app");
          return;
        }
        const workspace = await fetchWorkspace();
        if (!active) return;
        if (workspace?.organization) navigate({ to: "/app/inbox", replace: true });
        else navigate({ to: "/onboarding", replace: true });
      } catch {
        if (active) setError("Votre session n’a pas pu être vérifiée. Reconnectez-vous.");
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchWorkspace, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6">
        <SignalPath
          nodes={nodesFromIndex(["Session", "Organisation", "Espace"], error ? 0 : 1)}
          liveLabel={error ?? "Vérification de votre session."}
        />
        {error ? (
          <>
            <p role="alert" className="mt-6 text-sm text-destructive">
              {error}
            </p>
            <Button className="mt-4" onClick={() => window.location.replace("/auth?next=/app")}>
              Se reconnecter
            </Button>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">Ouverture de votre espace…</p>
        )}
      </div>
    </main>
  );
}
