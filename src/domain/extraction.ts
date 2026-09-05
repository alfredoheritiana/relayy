import type { Extraction, InterpretationProposal } from "./types";

/**
 * Interpréteur déterministe de secours (français).
 * Il ne remplace pas l'IA : il garantit un comportement utile quand l'IA
 * est indisponible, lente ou renvoie une sortie invalide.
 * Tout texte visiteur est traité comme une donnée, jamais comme une instruction.
 */

const norm = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const SERVICE_PATTERNS: ReadonlyArray<{ value: string; patterns: readonly string[] }> = [
  { value: "Bornage", patterns: ["borner", "bornage", "limite de propriete", "piquetage"] },
  {
    value: "Relevé topographique",
    patterns: ["releve topographique", "topographie", "topographique", "plan de terrain"],
  },
  { value: "Division", patterns: ["division", "diviser", "lotir", "lotissement", "parcelle a diviser"] },
  { value: "Implantation", patterns: ["implantation", "implanter", "tracer la construction"] },
  { value: "Expertise", patterns: ["expertise", "expert", "litige", "conflit de voisinage"] },
];

const TIMELINE_PATTERNS: ReadonlyArray<{ value: string; patterns: readonly string[] }> = [
  { value: "Dès que possible", patterns: ["des que possible", "au plus vite", "urgent", "cette semaine"] },
  { value: "Ce mois-ci", patterns: ["ce mois-ci", "dans les prochains jours", "sous quinzaine"] },
  { value: "Le mois prochain", patterns: ["le mois prochain", "mois prochain", "dans un mois"] },
  { value: "Dans 2 à 3 mois", patterns: ["dans deux mois", "dans 2 mois", "dans trois mois", "dans 3 mois", "ce trimestre"] },
  { value: "Plus tard / à définir", patterns: ["plus tard", "pas presse", "a definir", "l'annee prochaine", "annee prochaine"] },
];

const REASON_PATTERNS: ReadonlyArray<{ value: string; patterns: readonly string[] }> = [
  { value: "Pose d’une clôture", patterns: ["cloture", "clôture", "poser une cloture", "grillage"] },
  { value: "Projet de construction", patterns: ["construire", "construction", "batir", "extension", "maison"] },
  { value: "Vente du bien", patterns: ["vendre", "vente", "mise en vente"] },
  { value: "Achat du bien", patterns: ["acheter", "achat", "acquisition"] },
  { value: "Litige de voisinage", patterns: ["voisin", "litige", "desaccord"] },
  { value: "Division du terrain", patterns: ["diviser", "division", "detacher une parcelle"] },
];

const ADDRESS_REGEX =
  /\b(?:au|à|a|situe(?:e)? au|adresse\s*:?)\s*((?:n[°o]\s*)?\d{1,4}\s+[^,.;]{3,60}?)(?=\s*(?:,|\.|;|\bavant\b|\bpour\b|\bafin\b|$))/i;

const CITY_REGEX = /\b(?:à|a)\s+([A-ZÉÈÀÂÎÔÛÄËÏÖÜ][\p{L}'-]{2,}(?:\s+[A-ZÉÈÀÂÎÔÛ][\p{L}'-]{2,})?)/u;

function findMatch(
  text: string,
  table: ReadonlyArray<{ value: string; patterns: readonly string[] }>,
): { value: string; evidence: string } | null {
  const haystack = norm(text);
  for (const entry of table) {
    for (const pattern of entry.patterns) {
      if (haystack.includes(norm(pattern))) {
        return { value: entry.value, evidence: pattern };
      }
    }
  }
  return null;
}

export function extractDeterministic(
  text: string,
  allowedFieldKeys: readonly string[],
): InterpretationProposal {
  const extractions: Extraction[] = [];
  const allow = (key: string): boolean => allowedFieldKeys.includes(key);

  const service = findMatch(text, SERVICE_PATTERNS);
  if (service && allow("service")) {
    extractions.push({
      fieldKey: "service",
      value: service.value,
      confidence: 0.86,
      evidence: service.evidence,
    });
  }

  const reason = findMatch(text, REASON_PATTERNS);
  if (reason && allow("project_reason")) {
    extractions.push({
      fieldKey: "project_reason",
      value: reason.value,
      confidence: 0.82,
      evidence: reason.evidence,
    });
  }

  const timeline = findMatch(text, TIMELINE_PATTERNS);
  if (timeline && allow("timeline")) {
    extractions.push({
      fieldKey: "timeline",
      value: timeline.value,
      confidence: 0.84,
      evidence: timeline.evidence,
    });
  }

  if (allow("location")) {
    const streetMatch = ADDRESS_REGEX.exec(text);
    const raw = streetMatch?.[1]?.trim();
    if (raw) {
      const inline = /^(.+?)\s+(?:à|a)\s+(\p{Lu}[\p{L}'-]{2,}(?:\s+\p{Lu}[\p{L}'-]{2,})?)$/u.exec(raw);
      let value = raw;
      if (inline?.[1] && inline[2]) {
        value = `${inline[1].trim()}, ${inline[2].trim()}`;
      } else {
        const rest = text.slice((streetMatch?.index ?? 0) + (streetMatch?.[0]?.length ?? 0));
        const city = CITY_REGEX.exec(rest)?.[1]?.trim();
        if (city && !raw.includes(city)) value = `${raw}, ${city}`;
      }
      extractions.push({
        fieldKey: "location",
        value,
        confidence: 0.8,
        evidence: streetMatch?.[0]?.trim() ?? raw,
      });
    }
  }


  return {
    extractions,
    contradictions: [],
    clarificationNeeded: null,
    provider: "deterministic",
  };
}
