import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";
import { getWorkspace } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({
    meta: [
      { title: `Paramètres de l’espace — ${product.name}` },
      { name: "description", content: "Organisation, rôle et conservation des données Relay." },
      { property: "og:title", content: `Paramètres de l’espace — ${product.name}` },
      { property: "og:description", content: "Informations de votre organisation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const fetchWorkspace = useServerFn(getWorkspace);
  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const organization = workspace.data?.organization ?? null;

  return (
    <AppShell
      title="Paramètres"
      description="Informations de votre espace de travail."
      organizationName={organization?.name ?? null}
    >
      {workspace.isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : !organization ? (
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Aucun espace configuré pour ce compte.
          </p>
          <Button asChild className="mt-4">
            <Link to="/onboarding">Créer mon organisation</Link>
          </Button>
        </div>
      ) : (
        <dl className="grid gap-4 rounded-lg border border-border bg-card p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Organisation</dt>
            <dd className="text-foreground">{organization.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Identifiant public</dt>
            <dd className="text-foreground">{organization.slug}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Votre rôle</dt>
            <dd className="text-foreground">{organization.role}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Site web</dt>
            <dd className="text-foreground">{organization.websiteUrl ?? "—"}</dd>
          </div>
        </dl>
      )}
    </AppShell>
  );
}
