import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";
import { listExperiences } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/experiences/")({
  head: () => ({
    meta: [
      { title: `Expériences d’intake — ${product.name}` },
      { name: "description", content: "Vos parcours d’intake adaptatifs et leurs versions." },
      { property: "og:title", content: `Expériences d’intake — ${product.name}` },
      { property: "og:description", content: "Parcours publiés, brouillons et liens publics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExperiencesPage,
});

const statusLabels: Record<string, string> = {
  published: "Publié",
  draft: "Brouillon",
  archived: "Archivé",
};

function ExperiencesPage() {
  const fetchExperiences = useServerFn(listExperiences);
  const [copied, setCopied] = useState<string | null>(null);
  const experiences = useQuery({
    queryKey: ["experiences"],
    queryFn: () => fetchExperiences(),
  });

  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/e/${slug}`);
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <AppShell
      title="Expériences"
      description="Chaque parcours est versionné : les demandes gardent la version qui les a produites."
    >
      {experiences.isLoading ? (
        <ul className="space-y-3" aria-busy="true">
          {[0, 1].map((index) => (
            <li key={index} className="h-28 animate-pulse rounded-2xl bg-border" />
          ))}
        </ul>
      ) : experiences.isError ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p role="alert" className="text-sm text-destructive">
            Vos parcours n’ont pas pu être chargés.
          </p>
          <Button className="mt-4" onClick={() => experiences.refetch()}>
            Réessayer
          </Button>
        </div>
      ) : (experiences.data?.length ?? 0) === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-base text-foreground">Aucun parcours pour le moment.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Terminez la configuration de votre espace : Relay crée alors un premier parcours à
            partir de votre métier et de vos zones.
          </p>
          <Button asChild className="mt-5" size="sm">
            <Link to="/onboarding">Configurer mon espace</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {experiences.data?.map((experience) => (
            <li key={experience.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-medium text-foreground">{experience.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.goal}</p>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">
                    /e/{experience.slug}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    {statusLabels[experience.status] ?? experience.status}
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Mise à jour :{" "}
                    {new Date(experience.updated_at).toLocaleDateString("fr-BE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/e/$slug" params={{ slug: experience.slug }}>
                    Ouvrir le parcours
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => copyLink(experience.slug)}>
                  Copier le lien public
                </Button>
                {copied === experience.slug ? (
                  <span aria-live="polite" className="text-xs text-muted-foreground">
                    Lien copié.
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
