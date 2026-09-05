import { acceptedMap, completenessRatio, missingRequiredFields } from "./engine";
import type {
  DimensionScore,
  ExperienceDefinition,
  QualificationResult,
  QualificationRules,
  RecommendedAction,
  ScoreReason,
  SessionValue,
} from "./types";

function textOf(value: SessionValue | undefined): string {
  if (!value) return "";
  return Array.isArray(value.value) ? value.value.join(", ") : String(value.value);
}

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreFit(
  rules: QualificationRules,
  accepted: Map<string, SessionValue>,
): DimensionScore {
  const reasons: ScoreReason[] = [];
  const service = textOf(accepted.get("service"));
  const location = textOf(accepted.get("location"));

  if (!service) {
    return {
      dimension: "fit",
      score: null,
      reasons: [
        {
          ruleId: "fit.no_service",
          reason: "Aucun service identifié : le fit ne peut pas être calculé.",
          signal: "service absent",
          sourceField: "service",
          contribution: "neutral",
        },
      ],
    };
  }

  let score = 40;
  const supported = rules.supportedServices.some((item) => normalize(item) === normalize(service));
  if (supported) {
    score += 40;
    reasons.push({
      ruleId: "fit.supported_service",
      reason: "Le service demandé fait partie de l’offre déclarée.",
      signal: service,
      sourceField: "service",
      contribution: "positive",
    });
  } else {
    reasons.push({
      ruleId: "fit.unlisted_service",
      reason: "Le service demandé ne figure pas dans l’offre déclarée.",
      signal: service,
      sourceField: "service",
      contribution: "negative",
    });
  }

  if (location) {
    const inArea = rules.serviceAreas.some((area) => normalize(location).includes(normalize(area)));
    if (inArea) {
      score += 20;
      reasons.push({
        ruleId: "fit.service_area",
        reason: "L’adresse correspond à une zone d’intervention déclarée.",
        signal: location,
        sourceField: "location",
        contribution: "positive",
      });
    } else {
      reasons.push({
        ruleId: "fit.area_to_review",
        reason: "L’adresse est hors des zones connues : à vérifier, sans rejet automatique.",
        signal: location,
        sourceField: "location",
        contribution: "negative",
      });
    }
  }

  return { dimension: "fit", score: clamp(score), reasons };
}

function scoreIntent(accepted: Map<string, SessionValue>): DimensionScore {
  const reasons: ScoreReason[] = [];
  const reason = textOf(accepted.get("project_reason"));
  const service = textOf(accepted.get("service"));

  if (!reason && !service) {
    return {
      dimension: "intent",
      score: null,
      reasons: [
        {
          ruleId: "intent.no_signal",
          reason: "Ni service ni objectif de projet : intention non évaluable.",
          signal: "aucun signal",
          sourceField: null,
          contribution: "neutral",
        },
      ],
    };
  }

  let score = 40;
  if (service) {
    score += 25;
    reasons.push({
      ruleId: "intent.named_service",
      reason: "Le visiteur nomme une action concrète à réaliser.",
      signal: service,
      sourceField: "service",
      contribution: "positive",
    });
  }
  if (reason) {
    score += 25;
    reasons.push({
      ruleId: "intent.project_reason",
      reason: "Le projet a un objectif explicite.",
      signal: reason,
      sourceField: "project_reason",
      contribution: "positive",
    });
  }
  return { dimension: "intent", score: clamp(score), reasons };
}

function scoreUrgency(
  rules: QualificationRules,
  accepted: Map<string, SessionValue>,
): DimensionScore {
  const timeline = textOf(accepted.get("timeline"));
  if (!timeline) {
    return {
      dimension: "urgency",
      score: null,
      reasons: [
        {
          ruleId: "urgency.no_timeline",
          reason: "Aucune échéance connue : urgence non évaluable.",
          signal: "échéance absente",
          sourceField: "timeline",
          contribution: "neutral",
        },
      ],
    };
  }
  const near = rules.urgentTimelines.some((item) =>
    normalize(timeline).includes(normalize(item)),
  );
  return {
    dimension: "urgency",
    score: near ? 85 : 45,
    reasons: [
      {
        ruleId: near ? "urgency.near_term" : "urgency.later",
        reason: near
          ? "L’échéance annoncée est proche."
          : "L’échéance annoncée n’est pas immédiate.",
        signal: timeline,
        sourceField: "timeline",
        contribution: near ? "positive" : "negative",
      },
    ],
  };
}

function scoreCompleteness(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): DimensionScore {
  const ratio = completenessRatio(definition, values);
  const missing = missingRequiredFields(definition, values);
  const reasons: ScoreReason[] = [
    {
      ruleId: "completeness.required_ratio",
      reason: "Part des informations requises réellement acceptées.",
      signal: `${Math.round(ratio * 100)} %`,
      sourceField: null,
      contribution: ratio >= 0.8 ? "positive" : "negative",
    },
  ];
  if (missing.length > 0) {
    reasons.push({
      ruleId: "completeness.missing",
      reason: "Des informations requises manquent encore.",
      signal: missing.join(", "),
      sourceField: null,
      contribution: "negative",
    });
  }
  return { dimension: "completeness", score: clamp(ratio * 100), reasons };
}

export function qualify(
  definition: ExperienceDefinition,
  rules: QualificationRules,
  values: readonly SessionValue[],
): QualificationResult {
  const accepted = acceptedMap(definition, values);
  const dimensions: DimensionScore[] = [
    scoreFit(rules, accepted),
    scoreIntent(accepted),
    scoreUrgency(rules, accepted),
    scoreCompleteness(definition, values),
  ];

  const disqualifier = rules.disqualifiers.find((rule) => {
    const value = normalize(textOf(accepted.get(rule.fieldKey)));
    return value.length > 0 && rule.values.some((item) => value.includes(normalize(item)));
  });

  const completeness = dimensions.find((d) => d.dimension === "completeness")?.score ?? 0;
  const missingFields = missingRequiredFields(definition, values);

  let weightedSum = 0;
  let weightTotal = 0;
  for (const dimension of dimensions) {
    if (dimension.score === null) continue;
    const weight = rules.weights[dimension.dimension];
    weightedSum += dimension.score * weight;
    weightTotal += weight;
  }
  // On ne calcule un score global que si les dimensions évaluées pèsent au moins 60 %.
  const overallScore = weightTotal >= 0.6 ? clamp(weightedSum / weightTotal) : null;

  let recommendedAction: RecommendedAction;
  if (disqualifier) {
    recommendedAction = "not_a_fit";
  } else if (completeness < rules.thresholds.minCompleteness) {
    recommendedAction = "request_missing_information";
  } else if (overallScore !== null && overallScore >= rules.thresholds.highPriority) {
    recommendedAction = "high_priority_contact";
  } else if (overallScore !== null && overallScore >= rules.thresholds.standard) {
    recommendedAction = "standard_follow_up";
  } else {
    recommendedAction = "request_missing_information";
  }

  return {
    dimensions,
    overallScore,
    recommendedAction,
    missingFields,
    completeness,
  };
}

/** Résumé factuel déterministe, utilisé tel quel si l’IA échoue. */
export function deterministicSummary(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): string {
  const accepted = acceptedMap(definition, values);
  const parts: string[] = [];
  const service = textOf(accepted.get("service"));
  const location = textOf(accepted.get("location"));
  const reason = textOf(accepted.get("project_reason"));
  const timeline = textOf(accepted.get("timeline"));

  if (service) parts.push(`Demande : ${service}.`);
  if (location) parts.push(`Lieu : ${location}.`);
  if (reason) parts.push(`Objectif : ${reason}.`);
  if (timeline) parts.push(`Échéance annoncée : ${timeline}.`);
  if (parts.length === 0) parts.push("Demande reçue sans détail structuré exploitable.");
  return parts.join(" ");
}

export function buildIntent(
  definition: ExperienceDefinition,
  values: readonly SessionValue[],
): string {
  const accepted = acceptedMap(definition, values);
  const service = textOf(accepted.get("service"));
  return service ? service : "Demande à qualifier";
}
