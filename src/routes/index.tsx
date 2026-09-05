import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { demoConfig, product } from "@/config/product";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relay — l’intake adaptatif qui remplace vos formulaires" },
      {
        name: "description",
        content:
          "Relay transforme une phrase en demande structurée : une question utile à la fois, un récapitulatif clair, une demande exploitable côté entreprise.",
      },
      { property: "og:title", content: "Relay — l’intake adaptatif" },
      {
        property: "og:description",
        content:
          "Dites ce qu’il vous faut. Relay pose les bonnes questions et structure la demande pour l’entreprise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-20">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">{product.name}</p>
        <h1 className="text-4xl font-medium leading-tight sm:text-5xl">{product.tagline}</h1>
        <p className="max-w-xl text-base text-muted-foreground">{product.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/demo">Voir la démonstration</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/auth">Accéder à mon espace</Link>
        </Button>
      </div>


      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-medium text-muted-foreground">Exemple</h2>
        <p className="mt-2 text-sm text-foreground">« {demoConfig.referenceSentence} »</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Relay en retire le service, le lieu, l’objectif et l’échéance, puis ne pose que les
          questions réellement manquantes.
        </p>
      </section>
    </main>
  );
}
