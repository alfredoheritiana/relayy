/** Accès serveur aux sessions visiteur. Jamais importé par le navigateur. */
import { createHash, randomUUID } from "crypto";

import type { ExperienceDefinition, QualificationRules, SessionValue } from "@/domain/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface LoadedExperience {
  organizationId: string;
  organizationName: string;
  isDemo: boolean;
  experienceId: string;
  versionId: string;
  definition: ExperienceDefinition;
  rules: QualificationRules;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newToken(): string {
  return `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
}

export async function loadPublishedExperience(slug: string): Promise<LoadedExperience | null> {
  const { data, error } = await supabaseAdmin
    .from("experiences")
    .select(
      "id, organization_id, status, active_version_id, organizations(name, is_demo), experience_versions!experience_versions_experience_id_fkey(id, definition, qualification_rules)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[relay] lecture de l'expérience impossible", error.message);
    return null;
  }
  if (!data?.active_version_id) return null;

  const versions = (data.experience_versions ?? []) as Array<{
    id: string;
    definition: unknown;
    qualification_rules: unknown;
  }>;
  const version = versions.find((candidate) => candidate.id === data.active_version_id);
  if (!version) return null;

  const organization = data.organizations as { name: string; is_demo: boolean } | null;

  return {
    organizationId: data.organization_id,
    organizationName: organization?.name ?? "",
    isDemo: organization?.is_demo ?? false,
    experienceId: data.id,
    versionId: version.id,
    definition: version.definition as ExperienceDefinition,
    rules: version.qualification_rules as QualificationRules,
  };
}

export interface SessionRecord {
  id: string;
  organizationId: string;
  experienceId: string;
  versionId: string;
  status: string;
  isDemo: boolean;
  consentAt: string | null;
}

/** Charge une session uniquement si le jeton porteur correspond. */
export async function authorizeSession(
  sessionId: string,
  token: string,
): Promise<SessionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("interaction_sessions")
    .select(
      "id, organization_id, experience_id, experience_version_id, status, is_demo, consent_at, public_token_hash, expires_at",
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  if (data.public_token_hash !== hashToken(token)) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  return {
    id: data.id,
    organizationId: data.organization_id,
    experienceId: data.experience_id,
    versionId: data.experience_version_id,
    status: data.status,
    isDemo: data.is_demo,
    consentAt: data.consent_at,
  };
}

export async function loadSessionValues(session: SessionRecord): Promise<SessionValue[]> {
  const { data } = await supabaseAdmin
    .from("session_values")
    .select("field_key, value, source, confidence, source_message_id")
    .eq("session_id", session.id)
    .eq("is_current", true);

  return (data ?? []).map((row) => ({
    fieldKey: row.field_key,
    value: row.value as SessionValue["value"],
    source: row.source as SessionValue["source"],
    confidence: row.confidence,
    sourceMessageId: row.source_message_id,
  }));
}

export async function persistValues(
  session: SessionRecord,
  values: readonly SessionValue[],
): Promise<void> {
  if (values.length === 0) return;

  await supabaseAdmin
    .from("session_values")
    .update({ is_current: false })
    .eq("session_id", session.id)
    .eq("is_current", true);

  await supabaseAdmin.from("session_values").insert(
    values.map((value) => ({
      organization_id: session.organizationId,
      session_id: session.id,
      field_key: value.fieldKey,
      value: value.value as never,
      source: value.source,
      confidence: value.confidence,
      source_message_id: value.sourceMessageId ?? null,
      is_current: true,
    })),
  );
}

export async function logEvent(
  session: Pick<SessionRecord, "id" | "organizationId">,
  eventName: string,
  extra: { phase?: string | null; questionKey?: string | null; metadata?: Record<string, unknown> } = {},
): Promise<void> {
  await supabaseAdmin.from("interaction_events").insert({
    organization_id: session.organizationId,
    session_id: session.id,
    event_name: eventName,
    phase: extra.phase ?? null,
    question_key: extra.questionKey ?? null,
    metadata: (extra.metadata ?? {}) as never,
  });
}

export async function addMessage(
  session: SessionRecord,
  actor: "visitor" | "system",
  content: string,
  metadata: Record<string, unknown> = {},
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("interaction_messages")
    .insert({
      organization_id: session.organizationId,
      session_id: session.id,
      actor,
      content: content.slice(0, 4000),
      metadata: metadata as never,
    })
    .select("id")
    .maybeSingle();
  return data?.id ?? null;
}

export async function askedQuestionKeys(session: SessionRecord): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("interaction_events")
    .select("question_key")
    .eq("session_id", session.id)
    .eq("event_name", "question_shown");

  return (data ?? []).flatMap((row) => (row.question_key ? [row.question_key] : []));
}
