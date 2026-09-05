/** Contrats serveur du parcours visiteur (public, sans authentification). */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  acceptedMap,
  completenessRatio,
  computeProgress,
  contactSatisfied,
  findField,
  mergeValues,
  missingRequiredFields,
  nextStep,
  normalizeAnswer,
  pendingValues,
  progressLabel,
} from "@/domain/engine";
import { buildIntent, deterministicSummary, qualify } from "@/domain/scoring";
import type {
  ExperienceDefinition,
  NextStep,
  PhaseProgress,
  SessionValue,
} from "@/domain/types";

const startSchema = z.object({ slug: z.string().min(1).max(80) });
const answerSchema = z.object({
  sessionId: z.string().uuid(),
  token: z.string().min(20).max(200),
  questionKey: z.string().min(1).max(80),
  answer: z.union([z.string().max(4000), z.array(z.string().max(200)).max(20)]),
  freeText: z.boolean().default(false),
});
const sessionSchema = z.object({
  sessionId: z.string().uuid(),
  token: z.string().min(20).max(200),
});
const confirmSchema = sessionSchema.extend({
  corrections: z
    .array(z.object({ fieldKey: z.string().min(1).max(80), value: z.string().max(500) }))
    .max(20)
    .default([]),
  consent: z.boolean(),
});

export interface VisitorSummaryLine {
  fieldKey: string;
  label: string;
  value: string;
  source: SessionValue["source"];
  needsConfirmation: boolean;
}

export interface VisitorState {
  sessionId: string;
  token: string;
  organizationName: string;
  isDemo: boolean;
  definition: ExperienceDefinition;
  step: NextStep;
  progress: PhaseProgress[];
  progressLabel: string;
  summary: VisitorSummaryLine[];
  suggestions: VisitorSummaryLine[];
  completeness: number;
  missingFields: string[];
  contactSatisfied: boolean;
}

function buildLines(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): { summary: VisitorSummaryLine[]; suggestions: VisitorSummaryLine[] } {
  const accepted = acceptedMap(definition, values);
  const pending = pendingValues(definition, values);
  const toLine = (value: SessionValue, needsConfirmation: boolean): VisitorSummaryLine => ({
    fieldKey: value.fieldKey,
    label: findField(definition, value.fieldKey)?.label ?? value.fieldKey,
    value: Array.isArray(value.value) ? value.value.join(", ") : String(value.value),
    source: value.source,
    needsConfirmation,
  });

  return {
    summary: [...accepted.values()].map((value) => toLine(value, false)),
    suggestions: pending.map((value) => toLine(value, true)),
  };
}

async function buildState(
  session: { id: string; organizationId: string },
  token: string,
  organizationName: string,
  isDemo: boolean,
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
  asked: readonly string[],
): Promise<VisitorState> {
  const step = nextStep({ definition, values, askedKeys: asked });
  const progress = computeProgress(definition, values);
  const lines = buildLines(definition, values);

  return {
    sessionId: session.id,
    token,
    organizationName,
    isDemo,
    definition,
    step,
    progress,
    progressLabel: progressLabel(progress),
    summary: lines.summary,
    suggestions: lines.suggestions,
    completeness: completenessRatio(definition, values),
    missingFields: missingRequiredFields(definition, values),
    contactSatisfied: contactSatisfied(definition, values),
  };
}

export const startVisitorSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => startSchema.parse(data))
  .handler(async ({ data }): Promise<VisitorState | null> => {
    const {
      loadPublishedExperience,
      hashToken,
      newToken,
      logEvent,
    } = await import("./session.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const experience = await loadPublishedExperience(data.slug);
    if (!experience) return null;

    const token = newToken();
    const { data: inserted, error } = await supabaseAdmin
      .from("interaction_sessions")
      .insert({
        organization_id: experience.organizationId,
        experience_id: experience.experienceId,
        experience_version_id: experience.versionId,
        public_token_hash: hashToken(token),
        is_demo: experience.isDemo,
        current_phase: experience.definition.phases[0]?.key ?? "besoin",
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("[relay] création de session impossible", error?.message);
      return null;
    }

    const session = { id: inserted.id, organizationId: experience.organizationId };
    await logEvent(session, "session_started");

    const state = await buildState(
      session,
      token,
      experience.organizationName,
      experience.isDemo,
      experience.definition,
      [],
      [],
    );
    if (state.step.kind === "question" || state.step.kind === "clarification") {
      await logEvent(session, "question_shown", {
        questionKey: state.step.question.key,
        phase: state.step.question.phase,
      });
    }
    return state;
  });

export const submitVisitorAnswer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => answerSchema.parse(data))
  .handler(async ({ data }): Promise<VisitorState | null> => {
    const {
      authorizeSession,
      loadSessionValues,
      persistValues,
      logEvent,
      addMessage,
      askedQuestionKeys,
    } = await import("./session.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { interpretMessage } = await import("./interpret.server");

    const session = await authorizeSession(data.sessionId, data.token);
    if (!session || session.status === "completed") return null;

    const { data: versionRow } = await supabaseAdmin
      .from("experience_versions")
      .select("definition, organization_id, experiences(organizations(name, is_demo))")
      .eq("id", session.versionId)
      .maybeSingle();
    if (!versionRow) return null;

    const definition = versionRow.definition as ExperienceDefinition;
    const organization = (versionRow.experiences as { organizations?: { name: string; is_demo: boolean } } | null)
      ?.organizations;

    const question = definition.questions.find((candidate) => candidate.key === data.questionKey);
    if (!question) return null;

    const existing = await loadSessionValues(session);
    const messageId = await addMessage(
      session,
      "visitor",
      Array.isArray(data.answer) ? data.answer.join(", ") : data.answer,
      { questionKey: question.key },
    );

    let incoming: SessionValue[] = [];

    if (data.freeText && typeof data.answer === "string") {
      const allowedKeys = definition.fields
        .filter((field) => field.inferable && !field.sensitive)
        .map((field) => field.key);
      const proposal = await interpretMessage(definition, data.answer, allowedKeys);
      await logEvent(session, "interpretation_completed", {
        questionKey: question.key,
        metadata: { provider: proposal.provider, count: proposal.extractions.length },
      });
      incoming = proposal.extractions.flatMap((extraction) => {
        const field = findField(definition, extraction.fieldKey);
        if (!field) return [];
        const normalized = normalizeAnswer(field, extraction.value);
        if (normalized === null) return [];
        return [
          {
            fieldKey: field.key,
            value: normalized,
            source: extraction.confidence >= 0.78 ? "extracted_high" : "extracted_low",
            confidence: extraction.confidence,
            sourceMessageId: messageId,
          } satisfies SessionValue,
        ];
      });
    } else {
      const targetKey = question.targets[0];
      const field = targetKey ? findField(definition, targetKey) : null;
      if (field) {
        const normalized = normalizeAnswer(field, data.answer);
        if (normalized === null) {
          await logEvent(session, "answer_rejected", { questionKey: question.key });
        } else {
          incoming = [
            {
              fieldKey: field.key,
              value: normalized,
              source: existing.some((value) => value.fieldKey === field.key)
                ? "corrected"
                : "explicit",
              confidence: null,
              sourceMessageId: messageId,
            },
          ];
        }
      }
    }

    const merged = mergeValues(existing, incoming);
    await persistValues(session, merged);
    await logEvent(session, "answer_submitted", {
      questionKey: question.key,
      phase: question.phase,
    });

    const asked = [...(await askedQuestionKeys(session)), question.key];
    const state = await buildState(
      session,
      data.token,
      organization?.name ?? "",
      session.isDemo,
      definition,
      merged,
      asked,
    );

    if (state.step.kind === "question" || state.step.kind === "clarification") {
      await logEvent(session, "question_shown", {
        questionKey: state.step.question.key,
        phase: state.step.question.phase,
      });
    } else {
      await logEvent(session, "review_reached");
    }

    await supabaseAdmin
      .from("interaction_sessions")
      .update({
        last_activity_at: new Date().toISOString(),
        current_phase:
          state.progress.find((phase) => phase.state === "current")?.key ??
          definition.phases[0]?.key ??
          "besoin",
      })
      .eq("id", session.id);

    return state;
  });

export interface VisitorCompletion {
  leadId: string;
  summary: string;
  lines: VisitorSummaryLine[];
}

export const confirmVisitorSubmission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => confirmSchema.parse(data))
  .handler(async ({ data }): Promise<VisitorCompletion | { error: string }> => {
    const { authorizeSession, loadSessionValues, persistValues, logEvent } = await import(
      "./session.server"
    );
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (!data.consent) return { error: "consent_required" };

    const session = await authorizeSession(data.sessionId, data.token);
    if (!session) return { error: "session_invalide" };

    const { data: versionRow } = await supabaseAdmin
      .from("experience_versions")
      .select("definition, qualification_rules")
      .eq("id", session.versionId)
      .maybeSingle();
    if (!versionRow) return { error: "experience_introuvable" };

    const definition = versionRow.definition as ExperienceDefinition;
    const rules = versionRow.qualification_rules as Parameters<typeof qualify>[1];

    const existing = await loadSessionValues(session);
    const corrections: SessionValue[] = data.corrections.flatMap((correction) => {
      const field = findField(definition, correction.fieldKey);
      if (!field) return [];
      const normalized = normalizeAnswer(field, correction.value);
      if (normalized === null) return [];
      return [
        { fieldKey: field.key, value: normalized, source: "corrected", confidence: null } as const,
      ];
    });
    const values = mergeValues(existing, corrections);
    if (corrections.length > 0) await persistValues(session, values);

    if (!contactSatisfied(definition, values)) return { error: "contact_manquant" };

    // Idempotence : une session ne produit jamais deux demandes.
    const { data: already } = await supabaseAdmin
      .from("leads")
      .select("id, summary")
      .eq("session_id", session.id)
      .maybeSingle();

    const lines = buildLines(definition, values).summary;

    if (already) {
      return { leadId: already.id, summary: already.summary ?? "", lines };
    }

    const accepted = acceptedMap(definition, values);
    const read = (key: string) => {
      const value = accepted.get(key)?.value;
      if (value === undefined) return null;
      return Array.isArray(value) ? value.join(", ") : String(value);
    };

    const result = qualify(definition, rules, values);
    const summary = deterministicSummary(definition, values);

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .insert({
        organization_id: session.organizationId,
        session_id: session.id,
        contact_name: read("contact_name"),
        email: read("email"),
        phone: read("phone"),
        company_name: read("company_name"),
        summary,
        intent: buildIntent(definition, values),
        overall_score: result.overallScore,
        completeness_score: Math.round(result.completeness * 100),
        recommended_action: result.recommendedAction,
        missing_fields: [...result.missingFields],
        status: "new",
      })
      .select("id")
      .single();

    if (error || !lead) {
      console.error("[relay] création de la demande impossible", error?.message);
      return { error: "enregistrement_impossible" };
    }

    await supabaseAdmin.from("lead_scores").insert(
      result.dimensions.map((dimension) => ({
        organization_id: session.organizationId,
        lead_id: lead.id,
        dimension: dimension.dimension,
        score: dimension.score,
        reasons: dimension.reasons as never,
        rule_version: rules.ruleVersion,
      })),
    );

    await supabaseAdmin
      .from("interaction_sessions")
      .update({
        status: "completed",
        consent_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    await logEvent(session, "lead_created", { metadata: { leadId: lead.id } });

    return { leadId: lead.id, summary, lines };
  });

export const abandonVisitorSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sessionSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { authorizeSession, logEvent } = await import("./session.server");
    const session = await authorizeSession(data.sessionId, data.token);
    if (!session) return { ok: false };
    await logEvent(session, "session_abandoned");
    return { ok: true };
  });
