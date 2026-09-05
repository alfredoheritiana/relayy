import { Link, createFileRoute } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/relay/site-header";
import { product } from "@/config/product";

export const Route = createFileRoute("/legal/conditions")({
  head: () => ({
    meta: [
      { title: `Conditions d’utilisation — ${product.name}` },
      {
        name: "description",
        content:
          "Conditions d’utilisation des parcours d’intake Relay pour les entreprises et leurs visiteurs.",
      },
      { property: "og:title", content: `Conditions d’utilisation — ${product.name}` },
      { property: "og:description", content: "Cadre d’utilisation du produit Relay." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-0">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Conditions d’utilisation
        </h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            Relay est fourni comme outil d’intake adaptatif. L’entreprise utilisatrice reste
            responsable des informations qu’elle demande et de l’usage qu’elle fait des demandes
            reçues.
          </p>
          <p>
            Les scores produits par Relay sont explicables et déterministes. Ils constituent une
            aide à la décision, jamais une décision automatisée à valeur contractuelle.
          </p>
          <p>
            Les parcours en mode démonstration servent à l’évaluation du produit et ne créent pas
            d’engagement commercial.
          </p>
          <p>
            Le texte contractuel définitif reste à valider (voir{" "}
            <code>docs/FACTS_TO_CONFIRM.md</code>).
          </p>
        </div>
        <Link to="/" className="mt-10 inline-block text-sm underline underline-offset-4">
          Retour à l’accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
