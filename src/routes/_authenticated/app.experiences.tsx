import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { product } from "@/config/product";
import { listExperiences } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/experiences")({
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

function ExperiencesPage() {
  const fetchExperiences = useServerFn(listExperiences);
  const experiences = useQuery({
    queryKey: ["experiences"],
    queryFn: () => fetchExperiences(),
  });

  return (
    <AppShell
      title="Expériences"
      description="Chaque parcours est versionné : les demandes gardent la version qui les a produites."
    >
      {experiences.isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (experiences.data?.length ?? 0) === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucune expérience pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {experiences.data?.map((experience) => (
            <li
              key={experience.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-foreground">{experience.name}</span>
                <Badge variant="secondary">{experience.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{experience.goal}</p>
              <Link
                to="/e/$slug"
                params={{ slug: experience.slug }}
                className="mt-3 inline-block text-sm underline underline-offset-4"
              >
                Ouvrir le lien public
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
