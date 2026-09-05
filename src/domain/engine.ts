import type {
  ExperienceDefinition,
  FieldDefinition,
  FieldValue,
  NextStep,
  PhaseProgress,
  QuestionCandidate,
  SessionValue,
  ValueSource,
} from "./types";

/** Seuil au-dessus duquel une extraction non sensible satisfait un champ requis. */
export const HIGH_CONFIDENCE_THRESHOLD = 0.78;

const SOURCE_RANK: Record<ValueSource, number> = {
  extracted_low: 1,
  extracted_high: 2,
  explicit: 3,
  corrected: 4,
};

export function isEmptyValue(value: FieldValue | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim().length === 0;
}

export function findField(
  definition: ExperienceDefinition,
  key: string,
): FieldDefinition | undefined {
  return definition.fields.find((field) => field.key === key);
}

/**
 * Un champ est « accepté » (donc plus jamais redemandé) si la provenance de la valeur
 * est suffisante. Les champs sensibles exigent toujours une action explicite du visiteur.
 */
export function isAccepted(field: FieldDefinition, value: SessionValue): boolean {
  if (isEmptyValue(value.value)) return false;
  if (value.source === "corrected" || value.source === "explicit") return true;
  if (field.sensitive || !field.inferable) return false;
  if (value.source === "extracted_high") {
    return (value.confidence ?? 0) >= HIGH_CONFIDENCE_THRESHOLD;
  }
  return false;
}

/** Fusionne des valeurs entrantes selon la précédence corrected > explicit > extracted_high > extracted_low. */
export function mergeValues(
  current: readonly SessionValue[],
  incoming: readonly SessionValue[],
): SessionValue[] {
  const byKey = new Map<string, SessionValue>();
  for (const value of current) byKey.set(value.fieldKey, value);

  for (const candidate of incoming) {
    if (isEmptyValue(candidate.value)) continue;
    const existing = byKey.get(candidate.fieldKey);
    if (!existing) {
      byKey.set(candidate.fieldKey, candidate);
      continue;
    }
    const existingRank = SOURCE_RANK[existing.source];
    const candidateRank = SOURCE_RANK[candidate.source];
    if (candidateRank > existingRank) {
      byKey.set(candidate.fieldKey, candidate);
    } else if (candidateRank === existingRank && candidate.source !== "corrected") {
      // À provenance égale, la valeur la plus récente et la plus confiante gagne.
      if ((candidate.confidence ?? 1) >= (existing.confidence ?? 1)) {
        byKey.set(candidate.fieldKey, candidate);
      }
    }
  }
  return [...byKey.values()];
}

export function acceptedMap(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): Map<string, SessionValue> {
  const accepted = new Map<string, SessionValue>();
  for (const value of values) {
    const field = findField(definition, value.fieldKey);
    if (!field) continue;
    if (isAccepted(field, value)) accepted.set(field.key, value);
  }
  return accepted;
}

/** Valeurs proposées mais insuffisantes : affichées « à confirmer », jamais comptées. */
export function pendingValues(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): SessionValue[] {
  return values.filter((value) => {
    const field = findField(definition, value.fieldKey);
    if (!field) return false;
    return !isAccepted(field, value) && !isEmptyValue(value.value);
  });
}

export function requiredFields(definition: ExperienceDefinition): FieldDefinition[] {
  return definition.fields.filter((field) => field.required);
}

export function missingRequiredFields(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): string[] {
  const accepted = acceptedMap(definition, values);
  return requiredFields(definition)
    .filter((field) => !accepted.has(field.key))
    .map((field) => field.key);
}

export function completenessRatio(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): number {
  const required = requiredFields(definition);
  if (required.length === 0) return 1;
  const accepted = acceptedMap(definition, values);
  const satisfied = required.filter((field) => accepted.has(field.key)).length;
  return satisfied / required.length;
}

export function contactSatisfied(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): boolean {
  const accepted = acceptedMap(definition, values);
  return definition.minimumContactFields.every((key) => {
    const value = accepted.get(key);
    return value !== undefined && (value.source === "explicit" || value.source === "corrected");
  });
}

/** Contradictions matérielles détectées de façon déterministe (jamais par le modèle seul). */
export function detectContradictions(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): string[] {
  const contradictions: string[] = [];
  for (const value of values) {
    const field = findField(definition, value.fieldKey);
    if (!field || field.type !== "choice" || !field.choices) continue;
    if (Array.isArray(value.value)) continue;
    const allowed = field.choices.some((choice) => choice.value === value.value);
    if (!allowed && value.source !== "extracted_low") {
      contradictions.push(field.key);
    }
  }
  return contradictions;
}

function phaseIndex(definition: ExperienceDefinition, phaseKey: string): number {
  const index = definition.phases.findIndex((phase) => phase.key === phaseKey);
  return index === -1 ? definition.phases.length : index;
}

/** Questions encore utiles : au moins un champ cible non satisfait. */
export function eligibleQuestions(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
  askedKeys: readonly string[],
): QuestionCandidate[] {
  const accepted = acceptedMap(definition, values);
  return definition.questions.filter((question) => {
    if (askedKeys.includes(question.key)) return false;
    return question.targets.some((target) => {
      const field = findField(definition, target);
      if (!field) return false;
      if (accepted.has(target)) return false;
      return field.required || definition.minimumContactFields.includes(target);
    });
  });
}

export function rankQuestions(
  definition: ExperienceDefinition,
  questions: readonly QuestionCandidate[],
): QuestionCandidate[] {
  return [...questions].sort((a, b) => {
    const weight = (question: QuestionCandidate) =>
      Math.max(...question.targets.map((key) => findField(definition, key)?.weight ?? 0));
    const byWeight = weight(b) - weight(a);
    if (byWeight !== 0) return byWeight;
    const byPhase = phaseIndex(definition, a.phase) - phaseIndex(definition, b.phase);
    if (byPhase !== 0) return byPhase;
    const byGain = b.targets.length - a.targets.length;
    if (byGain !== 0) return byGain;
    return a.friction - b.friction;
  });
}

export interface NextStepInput {
  readonly definition: ExperienceDefinition;
  readonly values: readonly SessionValue[];
  readonly askedKeys: readonly string[];
  readonly clarificationCount?: number;
}

export function nextStep({
  definition,
  values,
  askedKeys,
  clarificationCount = 0,
}: NextStepInput): NextStep {
  const contradictions = detectContradictions(definition, values);
  const contradictedKey = contradictions[0];
  if (contradictedKey && clarificationCount < definition.maxClarifications) {
    const field = findField(definition, contradictedKey);
    const clarification: QuestionCandidate = {
      key: `clarify_${contradictedKey}`,
      phase: field?.phase ?? definition.phases[0]?.key ?? "besoin",
      targets: [contradictedKey],
      question: `Pouvez-vous préciser : ${field?.label ?? contradictedKey} ?`,
      reason: "Une information reçue ne correspond pas aux choix possibles.",
      input: field?.type ?? "text",
      ...(field?.choices ? { choices: field.choices } : {}),
      friction: 1,
    };
    return { kind: "clarification", question: clarification };
  }

  const ratio = completenessRatio(definition, values);
  const contactOk = contactSatisfied(definition, values);
  if (ratio >= definition.completionThreshold && contactOk) {
    return { kind: "review" };
  }

  const candidates = rankQuestions(definition, eligibleQuestions(definition, values, askedKeys));
  const best = candidates[0];
  if (!best) {
    return { kind: "review" };
  }
  if (askedKeys.length >= definition.maxQuestions) {
    return {
      kind: "max_questions_reached",
      missingFields: missingRequiredFields(definition, values),
    };
  }
  return { kind: "question", question: best };
}

/** Progression sémantique : phases terminées / en cours / à venir, jamais « question 4 sur 12 ». */
export function computeProgress(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): PhaseProgress[] {
  const accepted = acceptedMap(definition, values);
  const phaseDone = (phaseKey: string): boolean => {
    const fields = definition.fields.filter((field) => field.phase === phaseKey && field.required);
    if (fields.length === 0) return false;
    return fields.every((field) => accepted.has(field.key));
  };

  const firstOpen = definition.phases.findIndex((phase) => !phaseDone(phase.key));
  return definition.phases.map((phase, index) => ({
    key: phase.key,
    label: phase.label,
    state: phaseDone(phase.key)
      ? ("done" as const)
      : index === (firstOpen === -1 ? definition.phases.length : firstOpen)
        ? ("current" as const)
        : ("upcoming" as const),
  }));
}

export function progressLabel(progress: readonly PhaseProgress[]): string {
  const done = progress.filter((phase) => phase.state === "done").length;
  const current = progress.find((phase) => phase.state === "current");
  return current
    ? `Étape en cours : ${current.label}. ${done} étape(s) déjà complétée(s) sur ${progress.length}.`
    : `Toutes les étapes sont complétées (${progress.length}).`;
}

export function normalizeAnswer(field: FieldDefinition, raw: unknown): FieldValue | null {
  if (Array.isArray(raw)) {
    const list = raw.filter((item): item is string => typeof item === "string");
    return list.length > 0 ? list : null;
  }
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  if (field.type === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(trimmed);
    return valid ? trimmed.toLowerCase() : null;
  }
  if (field.type === "phone") {
    const valid = /^[+0-9 ().-]{6,20}$/.test(trimmed);
    return valid ? trimmed : null;
  }
  if (field.type === "choice" && field.choices) {
    return field.choices.some((choice) => choice.value === trimmed) ? trimmed : null;
  }
  return trimmed.slice(0, 2000);
}
