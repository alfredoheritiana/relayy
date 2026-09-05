import { createFileRoute } from "@tanstack/react-router";

import { VisitorFlow } from "@/components/relay/visitor-flow";
import { product } from "@/config/product";

export const Route = createFileRoute("/e/$slug")({
  head: () => ({
    meta: [
      { title: `Formuler une demande — ${product.name}` },
      {
        name: "description",
        content:
          "Expliquez votre besoin en une phrase : Relay structure votre demande et la transmet à l’entreprise.",
      },
      { property: "og:title", content: `Formuler une demande — ${product.name}` },
      {
        property: "og:description",
        content: "Parcours d’intake adaptatif : une question utile à la fois.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicExperiencePage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">Parcours indisponible</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ce lien n’est pas actif. Contactez l’entreprise pour obtenir un lien à jour.
      </p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">Parcours introuvable</h1>
    </div>
  ),
});

function PublicExperiencePage() {
  const { slug } = Route.useParams();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <VisitorFlow slug={slug} />
      </main>
    </div>
  );
}
