/**
 * Interprétation du langage naturel, côté serveur uniquement.
 *
 * Règles :
 *  - l'IA propose, elle ne décide jamais ;
 *  - toute sortie est validée puis filtrée sur les champs autorisés ;
 *  - toute erreur, indisponibilité ou sortie invalide bascule sur l'extraction
 *    déterministe, sans jamais interrompre le parcours du visiteur.
 */
import { z } from "zod";

import { extractDeterministic } from "@/domain/extraction";
import type { ExperienceDefinition, InterpretationProposal } from "@/domain/types";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";
const TIMEOUT_MS = 9000;

const aiSchema = z.object({
  extractions: z
    .array(
      z.object({
        fieldKey: z.string().min(1),
        value: z.union([z.string(), z.array(z.string())]),
        confidence: z.number().min(0).max(1),
        evidence: z.string().default(""),
      }),
    )
    .max(12)
    .default([]),
  contradictions: z.array(z.string()).max(5).default([]),
  clarificationNeeded: z.string().nullable().default(null),
});

function buildPrompt(definition: ExperienceDefinition, allowedKeys: readonly string[]): string {
  const fields = definition.fields
    .filter((field) => allowedKeys.includes(field.key))
    .map((field) => {
      const choices = field.choices?.map((choice) => choice.value).join(" | ");
      return `- ${field.key} (${field.type})${choices ? ` valeurs autorisées: ${choices}` : ""}`;
    })
    .join("\n");

  return [
    "Tu analyses le message d'un visiteur adressé à une entreprise.",
    "Tu extrais uniquement ce qui est explicitement exprimé. Tu n'inventes rien.",
    "Tu ne déduis jamais une adresse e-mail, un téléphone ou un nom.",
    "Pour un champ à valeurs autorisées, tu renvoies exactement l'une de ces valeurs, sinon tu ignores le champ.",
    "confidence reflète la certitude réelle : 0.9 si la phrase le dit clairement, 0.5 si c'est une interprétation.",
    "evidence cite le fragment exact du message.",
    "",
    "Champs autorisés :",
    fields,
    "",
    'Réponds uniquement en JSON : {"extractions":[{"fieldKey","value","confidence","evidence"}],"contradictions":[],"clarificationNeeded":null}',
  ].join("\n");
}

/**
 * Retourne toujours une proposition exploitable.
 * `provider` indique si l'IA a réellement répondu ou si le repli a été utilisé.
 */
export async function interpretMessage(
  definition: ExperienceDefinition,
  text: string,
  allowedKeys: readonly string[],
): Promise<InterpretationProposal> {
  const fallback = () => extractDeterministic(text, allowedKeys);
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey || text.trim().length < 3) return fallback();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildPrompt(definition, allowedKeys) },
          { role: "user", content: text.slice(0, 4000) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("[relay] passerelle IA indisponible", response.status);
      return fallback();
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return fallback();

    const parsed = aiSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error("[relay] sortie IA invalide", parsed.error.message);
      return fallback();
    }

    const byKey = new Map(definition.fields.map((field) => [field.key, field]));
    const extractions = parsed.data.extractions.flatMap((extraction) => {
      const field = byKey.get(extraction.fieldKey);
      // Filet de sécurité : champ inconnu, non autorisé, sensible ou non inférable.
      if (!field || !allowedKeys.includes(field.key) || field.sensitive || !field.inferable) {
        return [];
      }
      if (field.choices) {
        const allowed = field.choices.some((choice) => choice.value === extraction.value);
        if (!allowed) return [];
      }
      return [
        {
          fieldKey: field.key,
          value: extraction.value,
          confidence: extraction.confidence,
          evidence: extraction.evidence.slice(0, 280),
        },
      ];
    });

    if (extractions.length === 0 && !parsed.data.clarificationNeeded) return fallback();

    return {
      extractions,
      contradictions: parsed.data.contradictions,
      clarificationNeeded: parsed.data.clarificationNeeded,
      provider: "ai",
    };
  } catch (error) {
    console.error("[relay] échec de l'interprétation IA", error);
    return fallback();
  } finally {
    clearTimeout(timer);
  }
}
