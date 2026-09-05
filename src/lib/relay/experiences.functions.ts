import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  buildExperienceDefinition,
  buildQualificationRules,
  defaultSettings,
  type ExperienceSettings,
} from "@/domain/definitions/builder";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const settingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  goal: z.string().trim().min(4).max(300),
  services: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  serviceAreas: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  timelines: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
  askName: z.boolean().default(true),
  askPhone: z.boolean().default(false),
  askBudget: z.boolean().default(false),
  introPrompt: z.string().trim().max(200).default(""),
  completionBody: z.string().trim().max(400).default(""),
});

/** jsonb typé : la définition est sérialisée en JSON simple. */
function toJson<T>(value: T): never {
  return JSON.parse(JSON.stringify(value)) as never;
}

function slugify(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base === "" ? "parcours" : base;
}

/** Les réglages de l'éditeur sont conservés dans `branding.editor`. */
function readSettings(branding: unknown, fallbackName: string, fallbackGoal: string): ExperienceSettings {
  const editor =
    branding && typeof branding === "object" && "editor" in branding
      ? (branding as { editor: unknown }).editor
      : null;
  const parsed = settingsSchema.safeParse(editor);
  if (parsed.success) return parsed.data;
  return { ...defaultSettings, name: fallbackName, goal: fallbackGoal };
}

export interface ExperienceEditorData {
  id: string;
  name: string;
  slug: string;
  status: string;
  updatedAt: string;
  hasDraft: boolean;
  publishedVersion: number | null;
  draftVersion: number | null;
  settings: ExperienceSettings;
}

export const getExperienceEditor = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ experienceId: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }): Promise<ExperienceEditorData | null> => {
    const { data: experience, error } = await context.supabase
      .from("experiences")
      .select("id, name, slug, goal, status, branding, updated_at, active_version_id")
      .eq("id", data.experienceId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!experience) return null;

    const { data: versions } = await context.supabase
      .from("experience_versions")
      .select("id, version_number, published_at")
      .eq("experience_id", experience.id)
      .order("version_number", { ascending: false });

    const rows = versions ?? [];
    const draft = rows.find((row) => row.published_at === null) ?? null;
    const published = rows.find((row) => row.published_at !== null) ?? null;

    return {
      id: experience.id,
      name: experience.name,
      slug: experience.slug,
      status: experience.status,
      updatedAt: experience.updated_at,
      hasDraft: draft !== null,
      publishedVersion: published?.version_number ?? null,
      draftVersion: draft?.version_number ?? null,
      settings: readSettings(experience.branding, experience.name, experience.goal),
    };
  });

export const createExperience = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ organizationId: z.string().uuid(), settings: settingsSchema }).parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const settings = data.settings;
    const experienceId = crypto.randomUUID();
    const slug = `${slugify(settings.name)}-${Math.random().toString(36).slice(2, 7)}`;

    const { error: insertError } = await context.supabase.from("experiences").insert({
      id: experienceId,
      organization_id: data.organizationId,
      name: settings.name,
      slug,
      goal: settings.goal,
      status: "draft",
      branding: { editor: settings },
    });
    if (insertError) throw new Error(insertError.message);

    const { error: versionError } = await context.supabase.from("experience_versions").insert({
      organization_id: data.organizationId,
      experience_id: experienceId,
      version_number: 1,
      definition: toJson(buildExperienceDefinition(settings)),
      qualification_rules: toJson(buildQualificationRules(settings)),
      created_by: context.userId,
    });
    if (versionError) throw new Error(versionError.message);

    return { experienceId, slug };
  });

export const saveExperienceDraft = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ experienceId: z.string().uuid(), settings: settingsSchema }).parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const settings = data.settings;
    const { data: experience, error } = await context.supabase
      .from("experiences")
      .select("id, organization_id")
      .eq("id", data.experienceId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!experience) throw new Error("Parcours introuvable.");

    const { error: updateError } = await context.supabase
      .from("experiences")
      .update({ name: settings.name, goal: settings.goal, branding: { editor: settings } })
      .eq("id", experience.id);
    if (updateError) throw new Error(updateError.message);

    const { data: versions } = await context.supabase
      .from("experience_versions")
      .select("id, version_number, published_at")
      .eq("experience_id", experience.id)
      .order("version_number", { ascending: false });

    const rows = versions ?? [];
    const draft = rows.find((row) => row.published_at === null) ?? null;
    const definition = toJson(buildExperienceDefinition(settings));
    const rules = toJson(buildQualificationRules(settings));

    if (draft) {
      const { error: draftError } = await context.supabase
        .from("experience_versions")
        .update({ definition, qualification_rules: rules })
        .eq("id", draft.id);
      if (draftError) throw new Error(draftError.message);
      return { versionNumber: draft.version_number };
    }

    const nextNumber = (rows[0]?.version_number ?? 0) + 1;
    const { error: newError } = await context.supabase.from("experience_versions").insert({
      organization_id: experience.organization_id,
      experience_id: experience.id,
      version_number: nextNumber,
      definition,
      qualification_rules: rules,
      created_by: context.userId,
    });
    if (newError) throw new Error(newError.message);
    return { versionNumber: nextNumber };
  });

/** Publie le brouillon courant : les demandes existantes gardent leur version. */
export const publishExperience = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ experienceId: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { data: versions, error } = await context.supabase
      .from("experience_versions")
      .select("id, version_number, published_at")
      .eq("experience_id", data.experienceId)
      .order("version_number", { ascending: false });
    if (error) throw new Error(error.message);

    const draft = (versions ?? []).find((row) => row.published_at === null);
    if (!draft) throw new Error("Aucun brouillon à publier.");

    const { error: publishError } = await context.supabase
      .from("experience_versions")
      .update({ published_at: new Date().toISOString() })
      .eq("id", draft.id);
    if (publishError) throw new Error(publishError.message);

    const { error: experienceError } = await context.supabase
      .from("experiences")
      .update({ status: "published", active_version_id: draft.id })
      .eq("id", data.experienceId);
    if (experienceError) throw new Error(experienceError.message);

    return { versionNumber: draft.version_number };
  });
