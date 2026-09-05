import { describe, expect, it } from "vitest";

import {
  buildExperienceDefinition,
  buildQualificationRules,
  defaultSettings,
} from "../definitions/builder";
import { nextStep } from "../engine";

const settings = {
  ...defaultSettings,
  name: "Bureau test",
  goal: "Structurer les demandes.",
  services: ["Bornage", "Division"],
  serviceAreas: ["Waterloo"],
  askPhone: true,
  askBudget: true,
};

describe("buildExperienceDefinition", () => {
  it("génère les champs requis et l'e-mail sensible", () => {
    const definition = buildExperienceDefinition(settings);
    const required = definition.fields.filter((field) => field.required).map((f) => f.key);
    expect(required).toEqual(["service", "location", "project_reason", "timeline", "email"]);
    expect(definition.fields.find((field) => field.key === "email")?.sensitive).toBe(true);
  });

  it("ajoute les questions optionnelles activées", () => {
    const definition = buildExperienceDefinition(settings);
    const keys = definition.questions.map((question) => question.key);
    expect(keys).toContain("q_budget");
    expect(keys).toContain("q_phone");
  });

  it("propose d'abord la question d'ouverture", () => {
    const definition = buildExperienceDefinition(settings);
    const step = nextStep({ definition, values: [], askedKeys: [] });
    expect(step.kind).toBe("question");
    if (step.kind === "question") expect(step.question.opening).toBe(true);
  });

  it("dérive les règles des mêmes réglages sans inventer de valeurs", () => {
    const rules = buildQualificationRules(settings);
    expect(rules.supportedServices).toEqual(["Bornage", "Division"]);
    expect(rules.serviceAreas).toEqual(["Waterloo"]);
    expect(rules.urgentTimelines).toHaveLength(3);
    expect(rules.disqualifiers).toEqual([]);
  });
});
