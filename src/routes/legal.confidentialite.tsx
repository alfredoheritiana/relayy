import { Link, createFileRoute } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/relay/site-header";
import { product } from "@/config/product";

export const Route = createFileRoute("/legal/confidentialite")({
  head: () => ({
    meta: [
      { title: `Confidentialité — ${product.name}` },
      {
        name: "description",
        content:
          "Comment Relay traite les données transmises par les visiteurs et les entreprises utilisatrices.",
      },
      { property: "og:title", content: `Confidentialité — ${product.name}` },
      {
        property: "og:description",
        content: "Traitement des données des parcours d’intake Relay.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-0">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Confidentialité</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            Relay collecte uniquement les informations qu’un visiteur transmet volontairement dans
            un parcours d’intake : description du besoin, éléments de contexte et coordonnées.
          </p>
          <p>
            Les coordonnées ne sont jamais déduites d’un texte libre. Elles sont demandées de
            manière explicite et transmises seulement après consentement du visiteur.
          </p>
          <p>
            Chaque organisation accède uniquement à ses propres sessions, demandes et scores. Cette
            séparation est appliquée au niveau de la base de données.
          </p>
          <p>
            Les demandes en mode démonstration ne sont pas mélangées aux données réelles d’une
            organisation.
          </p>
          <p>
            Ce document décrit le comportement du produit. Le texte juridique définitif reste à
            valider avec un conseil (voir <code>docs/FACTS_TO_CONFIRM.md</code>).
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
