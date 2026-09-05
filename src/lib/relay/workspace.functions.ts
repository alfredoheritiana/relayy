import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface WorkspaceOrganization {
  id: string;
  name: string;
  slug: string;
  role: string;
  isDemo: boolean;
  websiteUrl: string | null;
}

export interface WorkspaceSummary {
  userId: string;
  organization: WorkspaceOrganization | null;
}

/** Organisation courante de l'utilisateur (première adhésion, propriétaire prioritaire). */
export const getWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WorkspaceSummary> => {
    const { data, error } = await context.supabase
      .from("organization_members")
      .select("role, organization_id, organizations(id, name, slug, is_demo, website_url)")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const rows = (data ?? []) as Array<{
      role: string;
      organizations: {
        id: string;
        name: string;
        slug: string;
        is_demo: boolean;
        website_url: string | null;
      } | null;
    }>;

    const preferred = rows.find((row) => row.role === "owner") ?? rows[0];
    if (!preferred?.organizations) {
      return { userId: context.userId, organization: null };
    }

    return {
      userId: context.userId,
      organization: {
        id: preferred.organizations.id,
        name: preferred.organizations.name,
        slug: preferred.organizations.slug,
        role: preferred.role,
        isDemo: preferred.organizations.is_demo,
        websiteUrl: preferred.organizations.website_url,
      },
    };
  });

const onboardingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  websiteUrl: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  industries: z.array(z.string().trim().min(1)).max(10).default([]),
  serviceAreas: z.array(z.string().trim().min(1)).max(20).default([]),
  services: z.array(z.string().trim().min(1)).max(20).default([]),
});

function slugify(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base === "" ? "org" : base;
}

/** Crée l'organisation, l'adhésion propriétaire, le profil d'activité et les services. */
export const createWorkspace = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => onboardingSchema.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const supabase = context.supabase;
    const slug = `${slugify(data.name)}-${Math.random().toString(36).slice(2, 8)}`;

    const { data: organizationId, error } = await supabase.rpc("create_workspace", {
      p_name: data.name,
      p_slug: slug,
      p_website_url: data.websiteUrl,
      p_description: data.description,
      p_industries: data.industries,
      p_service_areas: data.serviceAreas,
      p_services: data.services,
    });

    if (error) throw new Error(error.message);
    return { organizationId };
  });

export interface LeadListItem {
  id: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  intent: string | null;
  status: string;
  overallScore: number | null;
  recommendedAction: string | null;
  missingFields: string[];
  createdAt: string;
}

export const listLeads = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ status: z.string().optional() }).parse(data ?? {}))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }): Promise<LeadListItem[]> => {
    let query = context.supabase
      .from("leads")
      .select(
        "id, contact_name, email, phone, intent, status, overall_score, recommended_action, missing_fields, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (data.status && data.status !== "all") query = query.eq("status", data.status);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    return (rows ?? []).map((row) => ({
      id: row.id,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      intent: row.intent,
      status: row.status,
      overallScore: row.overall_score,
      recommendedAction: row.recommended_action,
      missingFields: row.missing_fields ?? [],
      createdAt: row.created_at,
    }));
  });

export const getLeadDetail = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ leadId: z.string().uuid() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { data: lead, error } = await context.supabase
      .from("leads")
      .select("*")
      .eq("id", data.leadId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!lead) return null;

    const [{ data: scores }, { data: values }, { data: messages }] = await Promise.all([
      context.supabase
        .from("lead_scores")
        .select("dimension, score, reasons, rule_version")
        .eq("lead_id", lead.id),
      context.supabase
        .from("session_values")
        .select("field_key, value, source, confidence")
        .eq("session_id", lead.session_id),
      context.supabase
        .from("interaction_messages")
        .select("actor, content, created_at")
        .eq("session_id", lead.session_id)
        .order("created_at", { ascending: true }),
    ]);

    return {
      lead: {
        id: lead.id,
        contactName: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        companyName: lead.company_name,
        intent: lead.intent,
        summary: lead.summary,
        status: lead.status,
        overallScore: lead.overall_score,
        completenessScore: lead.completeness_score,
        recommendedAction: lead.recommended_action,
        missingFields: lead.missing_fields ?? [],
        createdAt: lead.created_at,
      },
      scores: (scores ?? []).map((row) => ({
        dimension: row.dimension,
        score: row.score,
        reasons: normalizeReasons(row.reasons),
        ruleVersion: row.rule_version,
      })),
      values: dedupeValues(values ?? []).map((row) => ({
        fieldKey: row.field_key,
        value: String(row.value ?? ""),
        source: row.source,
        confidence: row.confidence,
      })),
      messages: (messages ?? []).map((row) => ({
        actor: row.actor,
        content: row.content,
        createdAt: row.created_at,
      })),
    };
  });

interface RawSessionValue {
  field_key: string;
  value: unknown;
  source: string;
  confidence: number | null;
}

/** Les scores stockent des raisons structurées ; l'UI n'affiche que le texte. */
function normalizeReasons(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object" && "reason" in entry) {
        const reason = (entry as { reason: unknown }).reason;
        return typeof reason === "string" ? reason : null;
      }
      return null;
    })
    .filter((entry): entry is string => entry !== null);
}

/** Une même information peut avoir plusieurs versions : on garde la dernière. */
function dedupeValues<T extends RawSessionValue>(rows: T[]): T[] {
  const byField = new Map<string, T>();
  for (const row of rows) byField.set(row.field_key, row);
  return [...byField.values()];
}

export const updateLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        leadId: z.string().uuid(),
        status: z.enum(["new", "to_contact", "qualified", "not_a_fit", "done"]),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.leadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listExperiences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("experiences")
      .select("id, name, slug, goal, status, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listKnowledge = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: sources, error }, { data: services }, { data: profiles }] = await Promise.all([
      context.supabase
        .from("knowledge_sources")
        .select("id, title, type, status, source_url, updated_at")
        .order("updated_at", { ascending: false }),
      context.supabase.from("services").select("id, name, description, active"),
      context.supabase
        .from("business_profiles")
        .select("description, industries, service_areas, status")
        .limit(1),
    ]);
    if (error) throw new Error(error.message);
    return {
      sources: sources ?? [],
      services: services ?? [],
      profile: profiles?.[0] ?? null,
    };
  });

export const addKnowledgeSource = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        organizationId: z.string().uuid(),
        title: z.string().trim().min(2).max(160),
        type: z.enum(["note", "url", "document"]),
        sourceUrl: z.string().trim().max(500).optional().default(""),
        content: z.string().trim().max(20000).optional().default(""),
      })
      .parse(data),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("knowledge_sources").insert({
      organization_id: data.organizationId,
      title: data.title,
      type: data.type,
      source_url: data.sourceUrl || null,
      content: data.content || null,
      status: data.content ? "ready" : "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: sessions }, { data: leads }, { data: events }] = await Promise.all([
      context.supabase.from("interaction_sessions").select("id, status, started_at").limit(1000),
      context.supabase
        .from("leads")
        .select("id, overall_score, status, missing_fields")
        .limit(1000),
      context.supabase.from("interaction_events").select("event_name, question_key").limit(2000),
    ]);

    const sessionRows = sessions ?? [];
    const leadRows = leads ?? [];
    const started = sessionRows.length;
    const completed = sessionRows.filter((s) => s.status === "completed").length;
    const abandoned = sessionRows.filter((s) => s.status === "abandoned").length;
    const scored = leadRows.filter((l) => typeof l.overall_score === "number");
    const averageScore =
      scored.length === 0
        ? null
        : Math.round(scored.reduce((sum, l) => sum + (l.overall_score ?? 0), 0) / scored.length);

    const missingCounts = new Map<string, number>();
    for (const lead of leadRows) {
      for (const field of lead.missing_fields ?? []) {
        missingCounts.set(field, (missingCounts.get(field) ?? 0) + 1);
      }
    }

    const dropOff = new Map<string, number>();
    for (const event of events ?? []) {
      if (event.event_name === "session_abandoned" && event.question_key) {
        dropOff.set(event.question_key, (dropOff.get(event.question_key) ?? 0) + 1);
      }
    }

    return {
      started,
      completed,
      abandoned,
      leads: leadRows.length,
      completionRate: started === 0 ? 0 : Math.round((completed / started) * 100),
      averageScore,
      missingFields: [...missingCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([field, count]) => ({ field, count })),
      dropOff: [...dropOff.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([questionKey, count]) => ({ questionKey, count })),
    };
  });
