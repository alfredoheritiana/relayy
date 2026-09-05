import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
import { ExperienceEditor } from "@/components/relay/experience-editor";
import { product } from "@/config/product";
import type { ExperienceSettings } from "@/domain/definitions/builder";
import { createExperience } from "@/lib/relay/experiences.functions";
import { getWorkspace } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/experiences/new")({
  head: () => ({
    meta: [
      { title: `Nouveau parcours — ${product.name}` },
      { name: "description", content: "Créer un parcours d’intake adaptatif étape par étape." },
      { property: "og:title", content: `Nouveau parcours — ${product.name}` },
      { property: "og:description", content: "Éditeur guidé de parcours d’intake." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewExperiencePage,
});

function NewExperiencePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchWorkspace = useServerFn(getWorkspace);
  const create = useServerFn(createExperience);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const organizationId = workspace.data?.organization?.id ?? null;

  const mutation = useMutation({
    mutationFn: (settings: ExperienceSettings) => {
      if (!organizationId) throw new Error("Votre espace n’est pas encore configuré.");
      return create({ data: { organizationId, settings } });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      navigate({
        to: "/app/experiences/$experienceId",
        params: { experienceId: result.experienceId },
      });
    },
  });

  return (
    <AppShell
      title="Nouveau parcours"
      description="Cinq décisions suffisent : Relay génère les questions et les règles de qualification."
      organizationName={workspace.data?.organization?.name ?? null}
    >
      <ExperienceEditor
        submitLabel="Créer le brouillon"
        pending={mutation.isPending}
        errorMessage={
          mutation.isError
            ? mutation.error instanceof Error
              ? mutation.error.message
              : "Création impossible."
            : null
        }
        onSubmit={(settings) => mutation.mutate(settings)}
      />
    </AppShell>
  );
}
