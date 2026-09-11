import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LiveRelayTrace } from "@/components/relay/live-trace";
import { RelayTrace, relayTraceCaptions } from "@/components/relay/relay-trace";
import { SiteFooter, SiteHeader } from "@/components/relay/site-header";
import { demoConfig } from "@/config/product";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relay — les humains expliquent, Relay structure" },
      {
        name: "description",
        content:
          "Relay comprend ce qui est déjà dit, ne pose que la question manquante et transmet une demande structurée, qualifiée et prête à traiter.",
      },
      {
        property: "og:title",
        content: "Relay — l’intake adaptatif pour les entreprises de services",
      },
      {
        property: "og:description",
        content:
          "Une phrase peut remplacer quatre questions. Relay transforme une intention en action.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const formFields = [
  "Nom",
  "E-mail",
  "Téléphone",
  "Type de service",
  "Adresse du terrain",
  "Commune",
  "Objectif du projet",
  "Délai souhaité",
  "Message libre",
];

const relayFacts = [
  { label: "Service", value: "Bornage" },
  { label: "Lieu", value: "23 rue X, Waterloo" },
  { label: "Contexte", value: "Pose d’une clôture" },
  { label: "Délai", value: "Le mois prochain" },
];

const scenes = [
  {
    index: "01",
    key: "CAPTURE",
    title: "Une question à la fois.",
    body: "Le visiteur écrit ce dont il a besoin, en une phrase. Aucun champ imposé, aucun questionnaire.",
  },
  {
    index: "02",
    key: "UNDERSTAND",
    title: "Des faits, avec leur provenance.",
    body: "Chaque information comprise est rattachée au fragment de phrase qui l’a produite, et reste corrigeable.",
  },
  {
    index: "03",
    key: "QUALIFY",
    title: "Un score explicable.",
    body: "Adéquation, intention, urgence et complétude sont calculées par vos règles, avec leurs raisons affichées.",
  },
  {
    index: "04",
    key: "ACT",
    title: "Une prochaine action nommée.",
    body: "La demande arrive avec l’action recommandée et l’information manquante, pas avec un transcript à lire.",
  },
] as const;

const audiences = [
  {
    index: "01",
    name: "Agences et studios",
    detail: "Qualifier le budget, le périmètre et le délai avant le premier appel.",
    example: "« Refonte de notre site e-commerce avant la rentrée, budget autour de 25 k€. »",
  },
  {
    index: "02",
    name: "Architectes et géomètres",
    detail: "Comprendre le lieu, le bien et l’objectif sans questionnaire cadastral.",
    example: demoConfig.referenceSentence,
  },
  {
    index: "03",
    name: "Construction et services terrain",
    detail: "Préparer un devis et une intervention avec l’adresse et la disponibilité.",
    example: "« Toiture à reprendre après la tempête, maison à Namur, dès que possible. »",
  },
  {
    index: "04",
    name: "Conseil B2B",
    detail: "Distinguer le contexte, l’urgence et le décisionnaire dès la demande.",
    example:
      "« Nous cherchons un accompagnement RGPD, décision prise par notre COMEX en octobre. »",
  },
] as const;

const principles = [
  {
    index: "01",
    title: "Jamais redemander ce qui est déjà connu.",
    proof: "La phrase de référence GeoLia fait sauter quatre questions du parcours.",
    mini: "4 questions évitées",
  },
  {
    index: "02",
    title: "Chaque question doit mériter sa place.",
    proof: "Les questions sont classées par valeur métier et coût de friction, puis filtrées.",
    mini: "1 question restante",
  },
  {
    index: "03",
    title: "L’IA propose. Vos règles décident.",
    proof: "Le scoring est déterministe et versionné : chaque score affiche ses raisons.",
    mini: "Score expliqué",
  },
] as const;

function SectionLabel({ children, tone = "light" }: { children: string; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "relay-label",
        tone === "dark" ? "text-relay-muted-dark" : "text-muted-foreground",
      )}
    >
      {children}
    </p>
  );
}

function Home() {
  const [comparison, setComparison] = useState<"form" | "relay">("form");
  const [traceStep, setTraceStep] = useState(0);
  const [audience, setAudience] = useState(0);
  const activeAudience = audiences[audience]!;

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-relay-black">
        <SiteHeader />
      </div>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-relay-black pb-16 pt-8 text-relay-white sm:pb-24 sm:pt-12 lg:pb-36 lg:pt-20">
          {/* Halo rouge, signature visuelle Relay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-relay-red/35 blur-[120px] motion-safe:animate-fade-in"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 size-[24rem] rounded-full bg-relay-blue/20 blur-[100px]"
          />
          <div className="relay-container relative grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <SectionLabel tone="dark">// RELAY · ADAPTIVE INTAKE</SectionLabel>
              <h1 className="relay-h1 mt-6 sm:mt-7">
                <span className="block">Les humains</span>
                <span
                  className="relay-voice block text-relay-red"
                  style={{ fontWeight: 700 }}
                >
                  expliquent.
                </span>
                <span className="block">Relay structure.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-relay-muted-dark sm:mt-8 sm:text-lg">
                Pas de formulaire. Pas de liste déroulante. Une phrase suffit&nbsp;: Relay en
                extrait le service, le lieu, l’objectif et le délai, ne demande que ce qui manque,
                et livre une demande qualifiée — pas un transcript à décoder.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-5">
                <Link
                  to="/e/$slug"
                  params={{ slug: "geolia-demo" }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-relay-red px-7 font-display text-base font-semibold text-relay-white transition-colors hover:bg-relay-red-dark"
                >
                  Commencer le parcours visiteur →
                </Link>
                <a
                  href="#live-trace"
                  className="inline-flex min-h-12 items-center justify-center font-display text-base font-semibold text-relay-white underline underline-offset-8 hover:text-relay-muted-dark"
                >
                  Voir Relay comprendre
                </a>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-relay-muted-dark">
                Aucun compte requis · Démonstration GeoLia
              </p>
            </div>

            <div className="lg:col-span-6">
              <LiveRelayTrace tone="dark" className="rounded-2xl" />
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="overflow-hidden border-y border-border bg-paper py-4">
          <div className="flex w-max motion-safe:relay-marquee">
            {[0, 1].map((copy) => (
              <p
                key={copy}
                aria-hidden={copy === 1}
                className="font-display whitespace-nowrap px-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground sm:text-base"
              >
                Une phrase → des faits → une question utile → une action claire ·&nbsp;&nbsp;Une
                phrase → des faits → une question utile → une action claire ·&nbsp;&nbsp;
              </p>
            ))}
          </div>
        </div>

        {/* MANIFESTE */}
        <section className="bg-paper py-20 lg:py-32">
          <div className="relay-container grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel>// 01 · LE PROBLÈME</SectionLabel>
              <h2 className="relay-h2 mt-6">
                Le formulaire demande à l’humain de{" "}
                <span className="relay-voice text-relay-red">penser comme une base de données</span>
                .
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
                Neuf champs pour une demande simple, des questions déjà répondues dans le message
                libre, et une fiche à reconstituer côté entreprise. Relay inverse l’effort.
              </p>

              <div
                role="tablist"
                aria-label="Comparaison formulaire et Relay"
                className="mt-8 flex border-b border-border"
              >
                {(
                  [
                    { id: "form", label: "Formulaire classique" },
                    { id: "relay", label: "Avec Relay" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    id={`tab-${tab.id}`}
                    aria-selected={comparison === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setComparison(tab.id)}
                    className={cn(
                      "min-h-11 px-4 font-display text-sm font-semibold transition-colors",
                      comparison === tab.id
                        ? "border-b-2 border-relay-red text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {comparison === "form" ? (
                <div
                  id="panel-form"
                  role="tabpanel"
                  aria-labelledby="tab-form"
                  className="mt-8 grid gap-3 sm:grid-cols-2"
                >
                  {formFields.map((field) => (
                    <div key={field} className="border-b border-border pb-3">
                      <p className="relay-label text-muted-foreground">{field}</p>
                      <div className="mt-2 h-9 rounded-lg border border-border bg-surface" />
                    </div>
                  ))}
                  <p className="font-mono text-xs text-muted-foreground sm:col-span-2">
                    9 champs · 0 information déduite · abandon fréquent
                  </p>
                </div>
              ) : (
                <div id="panel-relay" role="tabpanel" aria-labelledby="tab-relay" className="mt-8">
                  <p className="relay-voice text-2xl leading-snug">
                    {demoConfig.referenceSentence}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {relayFacts.map((fact) => (
                      <li key={fact.label} className="border-l-2 border-relay-blue pl-3">
                        <p className="relay-label text-muted-foreground">{fact.label}</p>
                        <p className="text-sm font-semibold">{fact.value}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-l-2 border-relay-red pl-3 font-display text-base font-semibold">
                    Question restante : votre adresse e-mail.
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    1 phrase · 4 faits compris · 1 question — Démonstration locale
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LIVE TRACE */}
        <section id="live-trace" className="bg-relay-red py-20 text-relay-white lg:py-32">
          <div className="relay-container">
            <SectionLabel tone="dark">// 02 · LA TRANSFORMATION</SectionLabel>
            <h2 className="relay-h2 mt-6 max-w-3xl">
              Une phrase. Quatre réponses. Zéro répétition.
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <RelayTrace
                  current={traceStep}
                  tone="dark"
                  orientation="vertical"
                  onSelect={setTraceStep}
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTraceStep((s) => Math.max(0, s - 1))}
                    disabled={traceStep === 0}
                    className="min-h-11 rounded-lg border border-relay-white/40 px-4 font-display text-sm font-semibold disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setTraceStep((s) => Math.min(3, s + 1))}
                    disabled={traceStep === 3}
                    className="min-h-11 rounded-lg bg-relay-white px-4 font-display text-sm font-semibold text-relay-black disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-relay-black p-6 sm:p-8">
                  <p className="relay-label text-relay-muted-dark">
                    {
                      relayTraceCaptions[
                        (["heard", "understood", "missing", "ready"] as const)[traceStep]!
                      ]
                    }
                  </p>
                  <p className="relay-voice mt-4 text-xl leading-snug sm:text-2xl">
                    {demoConfig.referenceSentence}
                  </p>

                  {traceStep >= 1 ? (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {relayFacts.map((fact) => (
                        <li key={fact.label} className="border-l-2 border-relay-blue pl-3">
                          <p className="relay-label text-relay-muted-dark">{fact.label}</p>
                          <p className="text-sm font-semibold">{fact.value}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {traceStep >= 2 ? (
                    <p className="mt-6 border-l-2 border-relay-orange pl-3 text-sm">
                      Information manquante : adresse e-mail de contact.
                    </p>
                  ) : null}

                  {traceStep >= 3 ? (
                    <p className="mt-4 border-l-2 border-relay-red pl-3 font-display text-base font-semibold">
                      Action préparée : demander l’e-mail, puis rappeler sous 24 h.
                    </p>
                  ) : null}
                </div>

                <Link
                  to="/e/$slug"
                  params={{ slug: "geolia-demo" }}
                  className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-relay-white px-6 font-display text-base font-semibold text-relay-black"
                >
                  Continuer comme visiteur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUIT */}
        <section id="product" className="bg-relay-black py-20 text-relay-white lg:py-32">
          <div className="relay-container">
            <SectionLabel tone="dark">// 03 · LE PRODUIT</SectionLabel>
            <h2 className="relay-h2 mt-6 max-w-3xl">
              De l’intention à l’action, tout est{" "}
              <span className="relay-voice text-relay-red">relié</span>.
            </h2>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-relay-line-dark md:grid-cols-2">
              {scenes.map((scene) => (
                <li key={scene.key} className="bg-relay-black p-7 sm:p-9">
                  <div className="flex items-baseline gap-4">
                    <span className="relay-label text-relay-red">{scene.index}</span>
                    <span className="relay-label text-relay-muted-dark">{scene.key}</span>
                  </div>
                  <h3 className="relay-h3 mt-4">{scene.title}</h3>
                  <p className="mt-3 max-w-md text-relay-muted-dark">{scene.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* LEAD OBJECT */}
        <section className="bg-paper py-20 lg:py-32">
          <div className="relay-container">
            <SectionLabel>// 04 · LE RÉSULTAT</SectionLabel>
            <h2 className="relay-h2 mt-6 max-w-3xl">Pas un transcript. Une décision préparée.</h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-12">
              <div className="bg-surface p-7 sm:p-10 lg:col-span-8">
                <span className="inline-flex bg-relay-black px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-relay-white">
                  Intent élevé
                </span>
                <h3 className="relay-h3 mt-5">Bornage avant pose d’une clôture</h3>
                <p className="mt-3 text-muted-foreground">
                  23 rue X, Waterloo · Le mois prochain · Complétude 80 %
                </p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {relayFacts.map((fact) => (
                    <li key={fact.label} className="border-l-2 border-relay-blue pl-3">
                      <p className="relay-label text-muted-foreground">{fact.label}</p>
                      <p className="text-sm font-semibold">{fact.value}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        Provenance : vous l’avez écrit
                      </p>
                    </li>
                  ))}
                </ul>
                <details className="mt-8 border-t border-border pt-4">
                  <summary className="min-h-11 cursor-pointer font-display text-sm font-semibold">
                    Voir la conversation source
                  </summary>
                  <p className="relay-voice mt-3 text-lg">{demoConfig.referenceSentence}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Relay : « Quelle est votre adresse e-mail ? »
                  </p>
                </details>
              </div>

              <div className="bg-relay-black p-7 text-relay-white sm:p-10 lg:col-span-4">
                <p className="relay-label text-relay-muted-dark">Scores</p>
                <ul className="mt-5 space-y-4">
                  {[
                    { name: "Fit", value: "Élevé", reason: "Service couvert et zone desservie" },
                    { name: "Intent", value: "Élevé", reason: "Projet daté et motif explicite" },
                    { name: "Urgency", value: "Moyen", reason: "Échéance à un mois" },
                    { name: "Completeness", value: "80 %", reason: "Coordonnées manquantes" },
                  ].map((dimension) => (
                    <li key={dimension.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="relay-label text-relay-muted-dark">{dimension.name}</span>
                        <span className="font-mono text-sm">{dimension.value}</span>
                      </div>
                      <p className="mt-1 text-sm text-relay-muted-dark">{dimension.reason}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 border-l-2 border-relay-red pl-3 font-display font-semibold">
                  Demander l’adresse e-mail puis rappeler sous 24 h
                </p>
                <p className="mt-4 font-mono text-[11px] text-relay-muted-dark">
                  Démonstration — données fictives
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POUR QUI */}
        <section id="pour-qui" className="bg-relay-blue py-20 text-relay-black lg:py-32">
          <div className="relay-container">
            <SectionLabel>// 05 · POUR QUI</SectionLabel>
            <h2 className="relay-h2 mt-6 max-w-4xl">
              Toute entreprise qui transforme une demande en travail.
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-12">
              <ul className="lg:col-span-7">
                {audiences.map((item, index) => (
                  <li key={item.name} className="border-t border-relay-black/25 last:border-b">
                    <button
                      type="button"
                      onMouseEnter={() => setAudience(index)}
                      onFocus={() => setAudience(index)}
                      onClick={() => setAudience(index)}
                      aria-pressed={audience === index}
                      className="flex w-full min-h-16 items-baseline gap-5 py-5 text-left"
                    >
                      <span className="relay-label">{item.index}</span>
                      <span className="flex-1">
                        <span
                          className={cn(
                            "font-display block text-2xl font-bold sm:text-3xl",
                            audience === index &&
                              "underline decoration-relay-red decoration-4 underline-offset-8",
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="mt-1 block text-sm">{item.detail}</span>
                        <span className="relay-voice mt-2 block text-base lg:hidden">
                          {item.example}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="hidden lg:col-span-5 lg:block">
                <div className="rounded-2xl bg-relay-black p-8 text-relay-white">
                  <p className="relay-label text-relay-muted-dark">Exemple d’intention</p>
                  <p className="relay-voice mt-4 text-2xl leading-snug">{activeAudience.example}</p>
                  <p className="mt-6 border-l-2 border-relay-red pl-3 text-sm">
                    {activeAudience.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPES */}
        <section className="bg-paper">
          {principles.map((principle) => (
            <div key={principle.index} className="border-b border-border">
              <div className="relay-container grid gap-6 py-12 lg:grid-cols-12 lg:py-16">
                <p className="relay-label text-relay-red lg:col-span-1">{principle.index}</p>
                <h3 className="relay-h3 lg:col-span-6">{principle.title}</h3>
                <p className="text-muted-foreground lg:col-span-3">{principle.proof}</p>
                <p className="lg:col-span-2">
                  <span className="inline-flex rounded-full border border-border px-3 py-1 font-mono text-xs">
                    {principle.mini}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA FINAL */}
        <section className="relative overflow-hidden bg-relay-black py-24 text-relay-white lg:py-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-relay-red/90"
          />
          <div className="relay-container relative">
            <h2 className="relay-h2 max-w-4xl">
              Votre prochain formulaire devrait déjà être votre{" "}
              <span className="relay-voice">dernier</span>.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-relay-muted-dark">
              Testez le parcours GeoLia, puis regardez la demande prendre forme côté entreprise.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/e/$slug"
                params={{ slug: "geolia-demo" }}
                className="inline-flex min-h-12 items-center rounded-lg bg-relay-white px-6 font-display text-base font-semibold text-relay-black"
              >
                Tester le parcours
              </Link>
              <Link
                to="/demo"
                className="inline-flex min-h-12 items-center rounded-lg border border-relay-white/50 px-6 font-display text-base font-semibold text-relay-white"
              >
                Voir la démo entreprise
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
