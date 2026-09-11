import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { SiteFooter, SiteHeader } from "@/components/relay/site-header";
import { Button } from "@/components/ui/button";
import { demoConfig, product } from "@/config/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: `Démonstration — ${product.name}` },
      {
        name: "description",
        content:
          "Voyez Relay des deux côtés : le parcours visiteur GeoLia et le tableau de bord entreprise en lecture seule.",
      },
      { property: "og:title", content: `Démonstration — ${product.name}` },
      {
        property: "og:description",
        content: "Une phrase, quatre faits, une question restante, un Lead Object.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoHubPage,
});

/** Fixtures locales, jamais mélangées aux données réelles d'une organisation. */
const demoLeads = [
  {
    id: "demo-1",
    contact: "marie.dubois@example.com",
    intent: "Bornage avant pose d’une clôture",
    facts: ["Waterloo", "Le mois prochain"],
    score: 95,
    status: "Nouveau",
    action: "Contacter en priorité",
  },
  {
    id: "demo-2",
    contact: "entreprise.hallet@example.com",
    intent: "Division d’une parcelle",
    facts: ["Braine-l’Alleud", "Dans 2 à 3 mois"],
    score: 72,
    status: "À contacter",
    action: "Suivi standard",
  },
  {
    id: "demo-3",
    contact: "j.perez@example.com",
    intent: "Relevé topographique",
    facts: ["Zone non desservie"],
    score: null,
    status: "Nouveau",
    action: "Demander les informations manquantes",
  },
] as const;

function DemoHubPage() {
  const [side, setSide] = useState<"visitor" | "company">("visitor");

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 sm:py-14 lg:px-10 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {demoConfig.badge}
        </p>
        <h1 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-6xl">
          Voyez Relay des deux côtés.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Une phrase → quatre faits → une question restante → un Lead Object.
        </p>

        <div className="mt-8">
          <SignalPath
            nodes={nodesFromIndex(
              ["Une phrase", "Quatre faits", "Une question", "Un Lead Object"],
              3,
            )}
          />
        </div>

        <div
          role="tablist"
          aria-label="Point de vue"
          className="mt-6 grid w-full max-w-full grid-cols-2 rounded-xl border border-border bg-surface p-1 sm:mt-10 sm:inline-flex sm:w-auto"
        >
          {(
            [
              ["visitor", "Je suis le visiteur"],
              ["company", "Je suis l’entreprise"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={side === value}
              onClick={() => setSide(value)}
              className={cn(
                "min-h-11 min-w-0 rounded-lg px-2 text-center text-xs transition-colors sm:flex-none sm:px-4 sm:text-sm",
                side === value
                  ? "bg-ink text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {side === "visitor" ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-7 lg:p-8">
              <h2 className="text-2xl font-medium text-foreground">
                Le parcours GeoLia, tel qu’un client le vit.
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Vous écrivez votre besoin en une phrase. Relay identifie le service, le lieu,
                l’objectif et le délai, puis ne demande que vos coordonnées.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to="/e/$slug" params={{ slug: demoConfig.experienceSlug }}>
                  Lancer le parcours visiteur
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-paper p-6 lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Phrase de référence
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                « {demoConfig.referenceSentence} »
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Tableau de bord entreprise, en lecture seule, alimenté par des fixtures locales.
              </p>
              <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-background">
                Démonstration
              </span>
            </div>

            <ul className="space-y-3">
              {demoLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-2xl border border-border bg-surface p-5 sm:flex sm:items-start sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="text-base font-medium text-foreground">{lead.intent}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{lead.contact}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {lead.facts.map((fact) => (
                        <li
                          key={fact}
                          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
                        >
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 shrink-0 text-left sm:mt-0 sm:text-right">
                    <p className="font-mono text-2xl text-foreground">
                      {lead.score === null ? (
                        <span className="text-sm text-muted-foreground">Données insuffisantes</span>
                      ) : (
                        `${lead.score}/100`
                      )}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{lead.status}</p>
                    <p className="mt-1 text-sm text-foreground">{lead.action}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground">
              Aucune de ces demandes n’existe en base : ce sont des exemples pour comprendre la
              lecture d’une inbox Relay.
            </p>
            <Button asChild variant="outline">
              <Link to="/auth">Créer mon espace réel</Link>
            </Button>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
