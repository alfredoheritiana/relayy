import { Link, createFileRoute } from "@tanstack/react-router";

import { VisitorFlow } from "@/components/relay/visitor-flow";
import { demoConfig, product } from "@/config/product";

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
    <div className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Parcours indisponible</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ce lien n’est pas actif. Contactez l’entreprise pour obtenir un lien à jour.
      </p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Parcours introuvable</h1>
    </div>
  ),
});

function PublicExperiencePage() {
  const { slug } = Route.useParams();
  const isDemo = slug === demoConfig.experienceSlug;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">
              {isDemo ? demoConfig.organizationName : product.name}
            </span>
          </Link>
          {isDemo ? (
            <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-background">
              {demoConfig.badge}
            </span>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <VisitorFlow slug={slug} {...(isDemo ? { demoHint: demoConfig.referenceSentence } : {})} />
      </main>
    </div>
  );
}
