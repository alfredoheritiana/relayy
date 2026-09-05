import { Link, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/relay/app-shell";
import { LeadDetailPanel } from "@/components/relay/lead-detail-panel";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";

export const Route = createFileRoute("/_authenticated/app/leads/$leadId")({
  head: () => ({
    meta: [
      { title: `Demande — ${product.name}` },
      { name: "description", content: "Détail d’une demande structurée reçue via Relay." },
      { property: "og:title", content: `Demande — ${product.name}` },
      { property: "og:description", content: "Action recommandée, score explicable et faits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { leadId } = Route.useParams();

  return (
    <AppShell
      title="Demande"
      description="Action recommandée, faits collectés, score explicable — la conversation en dernier."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/app/inbox">Retour à l’inbox</Link>
        </Button>
      }
    >
      <LeadDetailPanel leadId={leadId} />
    </AppShell>
  );
}
