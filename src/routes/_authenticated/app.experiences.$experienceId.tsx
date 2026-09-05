import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";


import { AppShell } from "@/components/relay/app-shell";
import { ExperienceEditor } from "@/components/relay/experience-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";
import type { ExperienceSettings } from "@/domain/definitions/builder";
import {
  getExperienceEditor,
  publishExperience,
  saveExperienceDraft,
} from "@/lib/relay/experiences.functions";

export const Route = createFileRoute("/_authenticated/app/experiences/$experienceId")({
  head: () => ({
    meta: [
      { title: `Éditeur de parcours — ${product.name}` },
      { name: "description", content: "Modifier un parcours d’intake et publier une version." },
      { property: "og:title", content: `Éditeur de parcours — ${product.name}` },
      { property: "og:description", content: "Brouillon, aperçu des questions et publication." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExperienceEditorPage,
});

function ExperienceEditorPage() {
  const { experienceId } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchExperience = useServerFn(getExperienceEditor);
  const save = useServerFn(saveExperienceDraft);
  const publish = useServerFn(publishExperience);

  const experience = useQuery({
    queryKey: ["experience", experienceId],
    queryFn: () => fetchExperience({ data: { experienceId } }),
  });

  const saveMutation = useMutation({
    mutationFn: (settings: ExperienceSettings) => save({ data: { experienceId, settings } }),
    onSuccess: () => {
      toast.success("Brouillon enregistré.");
      queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.");
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => publish({ data: { experienceId } }),
    onSuccess: (result) => {
      toast.success(`Version ${result.versionNumber} publiée.`);
      queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Publication impossible.");
    },
  });

  const data = experience.data;

  return (
    <AppShell
      title={data?.name ?? "Parcours"}
      description="Chaque enregistrement met à jour le brouillon ; la publication crée la version servie aux visiteurs."
      actions={
        data ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={data.status === "published" ? "secondary" : "outline"}>
              {data.status === "published" ? "Publié" : "Brouillon"}
            </Badge>
            <Button asChild size="sm" variant="outline">
              <Link to="/e/$slug" params={{ slug: data.slug }}>
                Ouvrir le parcours
              </Link>
            </Button>
            <Button
              size="sm"
              disabled={!data.hasDraft || publishMutation.isPending}
              onClick={() => publishMutation.mutate()}
            >
              {publishMutation.isPending ? "Publication…" : "Publier le brouillon"}
            </Button>
          </div>
        ) : null
      }
    >
      {experience.isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement du parcours…</p>
      ) : experience.isError ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p role="alert" className="text-sm text-destructive">
            Ce parcours n’a pas pu être chargé.
          </p>
          <Button className="mt-4" onClick={() => experience.refetch()}>
            Réessayer
          </Button>
        </div>
      ) : !data ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-base text-foreground">Ce parcours est introuvable.</p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/app/experiences">Revenir à la liste</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Version publiée : {data.publishedVersion ?? "aucune"} · Brouillon :{" "}
            {data.draftVersion ?? "aucun"}
          </p>
          {publishMutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {publishMutation.error instanceof Error
                ? publishMutation.error.message
                : "Publication impossible."}
            </p>
          ) : null}
          {saveMutation.isSuccess && !saveMutation.isPending ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              Brouillon enregistré.
            </p>
          ) : null}
          <ExperienceEditor
            initialSettings={data.settings}
            submitLabel="Enregistrer le brouillon"
            pending={saveMutation.isPending}
            errorMessage={
              saveMutation.isError
                ? saveMutation.error instanceof Error
                  ? saveMutation.error.message
                  : "Enregistrement impossible."
                : null
            }
            onSubmit={(settings) => saveMutation.mutate(settings)}
          />
        </div>
      )}
    </AppShell>
  );
}
