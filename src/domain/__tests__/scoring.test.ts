import { describe, expect, it } from "vitest";

import { geoliaDefinition, geoliaRules } from "@/domain/definitions/geolia";
import { buildIntent, deterministicSummary, qualify } from "@/domain/scoring";
import type { SessionValue } from "@/domain/types";

function value(fieldKey: string, raw: string): SessionValue {
  return { fieldKey, value: raw, source: "explicit", confidence: null };
}

const complete: SessionValue[] = [
  value("service", "Bornage"),
  value("location", "23 rue X à Waterloo"),
  value("project_reason", "poser une clôture"),
  value("timeline", "Le mois prochain"),
  value("contact_name", "Marie Dupont"),
  value("email", "marie@example.com"),
];

describe("qualify", () => {
  it("évalue les quatre dimensions", () => {
    const result = qualify(geoliaDefinition, geoliaRules, complete);
    expect(result.dimensions.map((dimension) => dimension.dimension)).toEqual([
      "fit",
      "intent",
      "urgency",
      "completeness",
    ]);
    for (const dimension of result.dimensions) {
      expect(dimension.reasons.length).toBeGreaterThan(0);
    }
  });

  it("produit un score global pondéré et une action recommandée", () => {
    const result = qualify(geoliaDefinition, geoliaRules, complete);
    expect(result.overallScore).not.toBeNull();
    expect(result.overallScore ?? 0).toBeGreaterThanOrEqual(geoliaRules.thresholds.standard);
    expect(["high_priority_contact", "standard_follow_up"]).toContain(result.recommendedAction);
  });

  it("laisse une dimension non évaluable plutôt que d’inventer un score", () => {
    const result = qualify(geoliaDefinition, geoliaRules, [value("service", "Bornage")]);
    const urgency = result.dimensions.find((dimension) => dimension.dimension === "urgency");
    expect(urgency?.score).toBeNull();
    expect(result.recommendedAction).toBe("request_missing_information");
  });

  it("est déterministe pour des entrées identiques", () => {
    const a = qualify(geoliaDefinition, geoliaRules, complete);
    const b = qualify(geoliaDefinition, geoliaRules, complete);
    expect(a).toEqual(b);
  });

  it("résume les faits sans texte génératif", () => {
    expect(deterministicSummary(geoliaDefinition, complete)).toContain("Bornage");
    expect(buildIntent(geoliaDefinition, complete)).toBe("Bornage");
  });
});
