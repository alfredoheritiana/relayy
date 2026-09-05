import { describe, expect, it } from "vitest";

import {
  acceptedMap,
  completenessRatio,
  computeProgress,
  contactSatisfied,
  mergeValues,
  missingRequiredFields,
  nextStep,
  normalizeAnswer,
  progressLabel,
} from "../engine";
import { extractDeterministic } from "../extraction";
import { deterministicSummary, qualify } from "../scoring";
import { geoliaDefinition, geoliaRules } from "../definitions/geolia";
import type { SessionValue } from "../types";
import { demoConfig } from "@/config/product";

const def = geoliaDefinition;

const value = (
  fieldKey: string,
  val: string,
  source: SessionValue["source"],
  confidence: number | null = null,
): SessionValue => ({ fieldKey, value: val, source, confidence });

describe("précédence des valeurs", () => {
  it("une correction remplace une valeur explicite", () => {
    const merged = mergeValues(
      [value("service", "Division", "explicit")],
      [value("service", "Bornage", "corrected")],
    );
    expect(merged[0]?.value).toBe("Bornage");
  });

  it("une extraction ne remplace pas une valeur explicite", () => {
    const merged = mergeValues(
      [value("service", "Division", "explicit")],
      [value("service", "Bornage", "extracted_high", 0.95)],
    );
    expect(merged[0]?.value).toBe("Division");
  });
});

describe("acceptation des valeurs", () => {
  it("une extraction confiante satisfait un champ requis non sensible", () => {
    const accepted = acceptedMap(def, [value("service", "Bornage", "extracted_high", 0.9)]);
    expect(accepted.has("service")).toBe(true);
  });

  it("une extraction peu confiante reste une suggestion", () => {
    const accepted = acceptedMap(def, [value("service", "Bornage", "extracted_low", 0.4)]);
    expect(accepted.has("service")).toBe(false);
  });

  it("un e-mail ne peut jamais être satisfait par inférence", () => {
    const accepted = acceptedMap(def, [value("email", "test@exemple.be", "extracted_high", 0.99)]);
    expect(accepted.has("email")).toBe(false);
    expect(contactSatisfied(def, [value("email", "test@exemple.be", "extracted_high", 0.99)])).toBe(
      false,
    );
  });
});

describe("phrase de référence GeoLia", () => {
  const proposal = extractDeterministic(
    demoConfig.referenceSentence,
    def.fields.map((field) => field.key),
  );

  it("extrait les quatre informations attendues", () => {
    const keys = proposal.extractions.map((extraction) => extraction.fieldKey).sort();
    expect(keys).toEqual(["location", "project_reason", "service", "timeline"]);
    const byKey = new Map(proposal.extractions.map((e) => [e.fieldKey, e.value]));
    expect(byKey.get("service")).toBe("Bornage");
    expect(byKey.get("project_reason")).toBe("Pose d’une clôture");
    expect(byKey.get("timeline")).toBe("Le mois prochain");
    expect(String(byKey.get("location"))).toContain("Waterloo");
  });

  it("ne repose pas les quatre questions déjà satisfaites", () => {
    const values = proposal.extractions.map((extraction) =>
      value(extraction.fieldKey, String(extraction.value), "extracted_high", extraction.confidence),
    );
    const step = nextStep({ definition: def, values, askedKeys: ["q_need"] });
    expect(step.kind).toBe("question");
    if (step.kind === "question") {
      expect(step.question.key).toBe("q_email");
    }
    expect(missingRequiredFields(def, values)).toEqual(["email"]);
  });
});

describe("sélection de la question suivante", () => {
  it("commence par la question d'ouverture puis suit la valeur métier", () => {
    const first = nextStep({ definition: def, values: [], askedKeys: [] });
    expect(first.kind).toBe("question");
    if (first.kind === "question") expect(first.question.key).toBe("q_need");

    const second = nextStep({ definition: def, values: [], askedKeys: ["q_need"] });
    if (second.kind === "question") expect(["q_service", "q_email"]).toContain(second.question.key);
  });

  it("passe en récapitulatif quand tout est satisfait", () => {
    const values = [
      value("service", "Bornage", "explicit"),
      value("location", "23 rue X, Waterloo", "explicit"),
      value("project_reason", "Pose d’une clôture", "explicit"),
      value("timeline", "Le mois prochain", "explicit"),
      value("email", "claire@exemple.be", "explicit"),
    ];
    expect(nextStep({ definition: def, values, askedKeys: [] }).kind).toBe("review");
    expect(completenessRatio(def, values)).toBe(1);
  });

  it("déclenche une clarification sur un choix hors liste", () => {
    const step = nextStep({
      definition: def,
      values: [value("service", "Déménagement", "explicit")],
      askedKeys: [],
    });
    expect(step.kind).toBe("clarification");
  });

  it("s'arrête proprement au nombre maximum de questions", () => {
    const asked = ["q_need", "q_service", "q_location", "q_reason", "q_timeline", "a", "b", "c"];
    const step = nextStep({ definition: def, values: [], askedKeys: asked });
    expect(step.kind).toBe("max_questions_reached");
  });
});

describe("correction et dépendances", () => {
  it("une correction invalide l'inférence précédente et modifie le récapitulatif", () => {
    const initial = [value("service", "Bornage", "extracted_high", 0.9)];
    const corrected = mergeValues(initial, [value("service", "Division", "corrected")]);
    expect(acceptedMap(def, corrected).get("service")?.value).toBe("Division");
    expect(deterministicSummary(def, corrected)).toContain("Division");
  });
});

describe("progression sémantique", () => {
  it("avance quand une réponse riche satisfait plusieurs champs", () => {
    const values = [
      value("service", "Bornage", "extracted_high", 0.9),
      value("location", "23 rue X, Waterloo", "extracted_high", 0.9),
      value("project_reason", "Pose d’une clôture", "extracted_high", 0.85),
    ];
    const progress = computeProgress(def, values);
    expect(progress[0]?.state).toBe("done");
    expect(progress[1]?.state).toBe("done");
    expect(progress[2]?.state).toBe("current");
    expect(progressLabel(progress)).toContain("Derniers détails");
  });
});

describe("qualification", () => {
  it("calcule des scores explicables pour une demande complète et proche", () => {
    const values = [
      value("service", "Bornage", "explicit"),
      value("location", "23 rue X, Waterloo", "explicit"),
      value("project_reason", "Pose d’une clôture", "explicit"),
      value("timeline", "Le mois prochain", "explicit"),
      value("email", "claire@exemple.be", "explicit"),
    ];
    const result = qualify(def, geoliaRules, values);
    expect(result.overallScore).not.toBeNull();
    expect(result.recommendedAction).toBe("high_priority_contact");
    for (const dimension of result.dimensions) {
      expect(dimension.reasons.length).toBeGreaterThan(0);
      expect(dimension.reasons[0]?.ruleId).toBeTruthy();
    }
  });

  it("affiche « données insuffisantes » au lieu d'inventer un score", () => {
    const result = qualify(def, geoliaRules, [value("email", "claire@exemple.be", "explicit")]);
    const fit = result.dimensions.find((d) => d.dimension === "fit");
    expect(fit?.score).toBeNull();
    expect(result.recommendedAction).toBe("request_missing_information");
  });
});

describe("normalisation", () => {
  it("rejette un e-mail invalide", () => {
    const field = def.fields.find((f) => f.key === "email");
    expect(field && normalizeAnswer(field, "pas-un-email")).toBeNull();
    expect(field && normalizeAnswer(field, "Claire@Exemple.BE")).toBe("claire@exemple.be");
  });

  it("rejette un choix hors liste", () => {
    const field = def.fields.find((f) => f.key === "service");
    expect(field && normalizeAnswer(field, "Plomberie")).toBeNull();
  });
});
