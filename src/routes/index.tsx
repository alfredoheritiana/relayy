import { Link, createFileRoute } from "@tanstack/react-router";

import { IntentComposer } from "@/components/relay/intent-composer";
import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { SiteFooter, SiteHeader } from "@/components/relay/site-header";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relay — votre formulaire collecte, Relay comprend" },
      {
        name: "description",
        content:
          "Relay extrait ce qui est déjà dit, ne pose que les questions manquantes et transmet une demande structurée, qualifiée et prête à traiter.",
      },
      { property: "og:title", content: "Relay — l’intake adaptatif pour les entreprises de services" },
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

const audiences = [
  {
    name: "Agences",
    situation:
      "Un prospect décrit un besoin de refonte. Relay récupère le périmètre, l’échéance et le budget avant le premier appel.",
  },
  {
    name: "Architectes et géomètres",
    situation:
      "Un particulier explique un projet de clôture. Relay identifie le bornage, la commune et le délai sans questionnaire.",
  },
  {
    name: "Construction",
    situation:
      "Une demande de chantier arrive avec la nature des travaux, l’adresse et la disponibilité déjà structurées.",
  },
  {
    name: "Conseil B2B",
    situation:
      "Une demande entrante est qualifiée sur la taille, le secteur et l’urgence avant d’entrer dans le pipeline.",
  },
];

const principles = [
  {
    title: "Jamais redemander ce qui est déjà connu.",
    proof: "La phrase de référence GeoLia fait sauter quatre questions du parcours.",
  },
  {
    title: "Chaque question doit mériter sa place.",
    proof: "Les questions sont classées par valeur métier et coût de friction, puis filtrées.",
  },
  {
    title: "L’IA propose. Vos règles décident.",
    proof: "Le scoring est déterministe et versionné : chaque score affiche ses raisons.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-12 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              L’intake adaptatif pour les entreprises de services
            </p>
            <h1 className="mt-5 text-[42px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[68px]">
              Votre formulaire collecte des champs. Relay comprend une demande.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Une personne explique ce dont elle a besoin. Relay extrait ce qui est déjà dit, pose
              uniquement les questions manquantes et transmet à votre équipe une demande prête à
              traiter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#demo-live">Voir Relay comprendre</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">Créer mon expérience</Link>
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Moins de répétitions · plus de contexte · une prochaine action claire
            </p>
          </div>

          <div className="lg:col-span-5">
            <IntentComposer variant="hero" />
          </div>
        </section>

        {/* BANDE DE TRANSFORMATION */}
        <section className="bg-ink text-background">
          <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
            <SignalPath
              tone="dark"
              nodes={nodesFromIndex(
                ["Expliquez naturellement", "Relay structure", "Relay clarifie", "Votre équipe agit"],
                3,
              )}
            />
            <div className="mt-8 grid gap-6 text-sm leading-relaxed text-background/70 md:grid-cols-4">
              <p>Le visiteur écrit une phrase, comme au téléphone.</p>
              <p>Relay extrait les faits utiles et leur provenance.</p>
              <p>Il ne pose que ce qui manque réellement.</p>
              <p>La demande arrive scorée, avec une action recommandée.</p>
            </div>
          </div>
        </section>

        {/* PROBLÈME */}
        <section id="produit" className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Le formulaire demande à l’humain de penser comme une base de données.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Relay fait l’inverse : l’humain s’exprime, le logiciel structure ensuite.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Formulaire traditionnel
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Nom",
                  "Prénom",
                  "Société",
                  "E-mail",
                  "Téléphone",
                  "Type de service",
                  "Adresse du bien",
                  "Délai souhaité",
                  "Message",
                ].map((field) => (
                  <li
                    key={field}
                    className="flex h-10 items-center rounded-md border border-border px-3 text-sm text-muted-foreground"
                  >
                    {field}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Neuf champs à remplir avant de savoir si l’entreprise peut aider.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Expérience Relay
              </p>
              <p className="mt-4 text-2xl font-medium leading-snug text-foreground">
                De quoi avez-vous besoin ?
              </p>
              <p className="mt-3 rounded-xl border border-border bg-paper p-4 text-base leading-relaxed text-foreground">
                « Je voudrais faire borner mon terrain au 23 rue X à Waterloo avant de poser une
                clôture le mois prochain. »
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  ["Service", "Bornage"],
                  ["Lieu", "23 rue X, Waterloo"],
                  ["Objectif", "Pose d’une clôture"],
                  ["Délai", "Le mois prochain"],
                ].map(([label, value]) => (
                  <li key={label} className="rounded-lg border border-border bg-paper px-3 py-2">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-foreground">
                Une seule question reste : l’adresse e-mail, demandée explicitement.
              </p>
            </div>
          </div>
        </section>

        {/* DÉMONSTRATION */}
        <section id="demo-live" className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-12 lg:px-10 lg:py-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Une phrase peut remplacer quatre questions.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Modifiez la phrase, relancez l’analyse et observez ce que Relay comprend. Cette
                démonstration tourne dans votre navigateur, sans créer de demande.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/e/$slug" params={{ slug: "geolia-demo" }}>
                    Continuer l’expérience complète
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/demo">Voir les deux côtés</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <IntentComposer variant="section" editable />
            </div>
          </div>
        </section>

        {/* LEAD OBJECT */}
        <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Pas un transcript. Une décision préparée.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <article className="rounded-2xl border border-border bg-ink p-6 text-background lg:col-span-7 lg:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                Intent élevé
              </p>
              <h3 className="mt-3 text-2xl font-medium">Bornage avant pose d’une clôture</h3>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Lieu", "Waterloo"],
                  ["Délai", "Le mois prochain"],
                  ["Complétude", "80 % — coordonnées manquantes"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-background/50">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 rounded-xl bg-background/10 p-4 text-sm">
                Action recommandée : demander l’adresse e-mail puis contacter.
              </p>
              <p className="mt-4 text-xs text-background/50">
                Le transcript complet reste accessible en second plan.
              </p>
            </article>
            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Score et raisons
              </p>
              <ul className="mt-4 space-y-4 text-sm">
                {[
                  ["Fit", "Service couvert, zone desservie"],
                  ["Intent", "Projet daté et motivé"],
                  ["Urgency", "Échéance sous un mois"],
                  ["Completeness", "Coordonnées encore manquantes"],
                ].map(([dimension, reason]) => (
                  <li key={dimension} className="border-b border-border pb-3 last:border-0">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
                      {dimension}
                    </p>
                    <p className="mt-1 text-muted-foreground">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* POUR QUI */}
        <section id="pour-qui" className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Pour qui
            </h2>
            <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {audiences.map((audience) => (
                <div key={audience.name} className="border-t border-border pt-5">
                  <dt className="text-xl font-medium text-foreground">{audience.name}</dt>
                  <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {audience.situation}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* PRINCIPES */}
        <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <ul className="space-y-8">
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="grid gap-3 border-t border-border pt-6 md:grid-cols-12"
              >
                <p className="text-2xl font-medium leading-snug text-foreground md:col-span-6">
                  {principle.title}
                </p>
                <p className="text-base text-muted-foreground md:col-span-6">{principle.proof}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-[1440px] px-5 pb-20 lg:px-10">
          <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-14">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Transformez votre prochaine demande en prochaine action.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/e/$slug" params={{ slug: "geolia-demo" }}>
                  Tester le parcours GeoLia
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/auth">Créer mon espace</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
