import { Link, createFileRoute } from "@tanstack/react-router";

import { VisitorFlow } from "@/components/relay/visitor-flow";
import { demoConfig, product } from "@/config/product";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: `Démo GeoLia — ${product.name}` },
      {
        name: "description",
        content:
          "Essayez l’intake adaptatif Relay sur la démonstration GeoLia : décrivez votre besoin en une phrase, Relay pose seulement les questions utiles.",
      },
      { property: "og:title", content: `Démo GeoLia — ${product.name}` },
      {
        property: "og:description",
        content: "Parcours d’intake adaptatif en démonstration, sans inscription.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-sm font-semibold text-foreground">
            {product.name}
          </Link>
          <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
            {demoConfig.badge}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-foreground">
          {demoConfig.organizationName}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Décrivez votre besoin comme vous le diriez au téléphone. Relay comprend, puis ne
          demande que ce qui manque.
        </p>

        <div className="mt-8">
          <VisitorFlow slug={demoConfig.experienceSlug} demoHint={demoConfig.referenceSentence} />
        </div>
      </main>
    </div>
  );
}
