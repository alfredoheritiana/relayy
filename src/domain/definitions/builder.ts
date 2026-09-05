import type {
  Choice,
  ExperienceDefinition,
  FieldDefinition,
  QualificationRules,
  QuestionCandidate,
} from "../types";

/** Réglages saisis dans l'éditeur guidé : source unique de vérité d'une expérience. */
export interface ExperienceSettings {
  readonly name: string;
  readonly goal: string;
  readonly services: readonly string[];
  readonly serviceAreas: readonly string[];
  readonly timelines: readonly string[];
  readonly askName: boolean;
  readonly askPhone: boolean;
  readonly askBudget: boolean;
  readonly introPrompt: string;
  readonly completionBody: string;
}

export const defaultTimelines = [
  "Dès que possible",
  "Ce mois-ci",
  "Le mois prochain",
  "Dans 2 à 3 mois",
  "Plus tard, à définir",
] as const;

export const defaultSettings: ExperienceSettings = {
  name: "Nouveau parcours",
  goal: "Structurer les demandes entrantes.",
  services: [],
  serviceAreas: [],
  timelines: [...defaultTimelines],
  askName: true,
  askPhone: false,
  askBudget: false,
  introPrompt: "De quoi avez-vous besoin ?",
  completionBody:
    "Elle a bien été transmise avec les informations affichées dans le récapitulatif.",
};

const toChoices = (values: readonly string[]): Choice[] =>
  values.map((value) => ({ value, label: value }));

/** Construit une définition déterministe à partir des réglages de l'éditeur. */
export function buildExperienceDefinition(settings: ExperienceSettings): ExperienceDefinition {
  const serviceChoices = toChoices([
    ...settings.services,
    ...(settings.services.length > 0 ? ["Je ne sais pas"] : []),
  ]);
  const timelineChoices = toChoices(
    settings.timelines.length > 0 ? settings.timelines : [...defaultTimelines],
  );

  const fields: FieldDefinition[] = [
    {
      key: "service",
      label: "Service souhaité",
      type: serviceChoices.length > 0 ? "choice" : "text",
      required: true,
      sensitive: false,
      inferable: true,
      phase: "besoin",
      weight: 5,
      ...(serviceChoices.length > 0 ? { choices: serviceChoices } : {}),
    },
    {
      key: "location",
      label: "Localisation du projet",
      type: "address",
      required: true,
      sensitive: false,
      inferable: true,
      phase: "projet",
      weight: 4,
    },
    {
      key: "project_reason",
      label: "Objectif du projet",
      type: "text",
      required: true,
      sensitive: false,
      inferable: true,
      phase: "projet",
      weight: 3,
    },
    {
      key: "timeline",
      label: "Échéance",
      type: "choice",
      required: true,
      sensitive: false,
      inferable: true,
      phase: "details",
      weight: 3,
      choices: timelineChoices,
    },
    {
      key: "email",
      label: "Adresse e-mail",
      type: "email",
      required: true,
      sensitive: true,
      inferable: false,
      phase: "contact",
      weight: 5,
    },
  ];

  if (settings.askBudget) {
    fields.push({
      key: "budget",
      label: "Budget envisagé",
      type: "budget",
      required: false,
      sensitive: false,
      inferable: true,
      phase: "details",
      weight: 2,
    });
  }
  if (settings.askName) {
    fields.push({
      key: "contact_name",
      label: "Nom",
      type: "text",
      required: false,
      sensitive: true,
      inferable: false,
      phase: "contact",
      weight: 2,
    });
  }
  if (settings.askPhone) {
    fields.push({
      key: "phone",
      label: "Téléphone",
      type: "phone",
      required: false,
      sensitive: true,
      inferable: false,
      phase: "contact",
      weight: 2,
    });
  }

  const questions: QuestionCandidate[] = [
    {
      key: "q_need",
      phase: "besoin",
      targets: ["service", "location", "project_reason", "timeline"],
      question: settings.introPrompt || "De quoi avez-vous besoin ?",
      placeholder: "Expliquez votre situation avec vos propres mots…",
      input: "longtext",
      friction: 2,
      opening: true,
    },
    {
      key: "q_service",
      phase: "besoin",
      targets: ["service"],
      question: "Quel type de service semble correspondre ?",
      reason: "Cela oriente votre demande vers la bonne compétence.",
      input: serviceChoices.length > 0 ? "choice" : "text",
      ...(serviceChoices.length > 0 ? { choices: serviceChoices } : {}),
      friction: 1,
    },
    {
      key: "q_location",
      phase: "projet",
      targets: ["location"],
      question: "Où se situe le projet ?",
      reason: "L’adresse détermine la faisabilité et le déplacement.",
      placeholder: "Rue, numéro et commune",
      input: "address",
      friction: 1,
    },
    {
      key: "q_reason",
      phase: "projet",
      targets: ["project_reason"],
      question: "Qu’aimeriez-vous réaliser ou sécuriser ?",
      placeholder: "Par exemple : poser une clôture, vendre, construire…",
      input: "text",
      friction: 2,
    },
    {
      key: "q_timeline",
      phase: "details",
      targets: ["timeline"],
      question: "Quand souhaitez-vous avancer ?",
      input: "choice",
      choices: timelineChoices,
      friction: 1,
    },
  ];

  if (settings.askBudget) {
    questions.push({
      key: "q_budget",
      phase: "details",
      targets: ["budget"],
      question: "Avez-vous une enveloppe budgétaire en tête ?",
      reason: "Cela évite des échanges inutiles.",
      input: "budget",
      friction: 3,
      optional: true,
    });
  }

  questions.push({
    key: "q_email",
    phase: "contact",
    targets: ["email"],
    question: "À quelle adresse e-mail pouvons-nous transmettre la suite ?",
    reason: "C’est la seule façon de vous répondre.",
    placeholder: "vous@exemple.be",
    input: "email",
    friction: 1,
  });

  if (settings.askPhone) {
    questions.push({
      key: "q_phone",
      phase: "contact",
      targets: ["phone"],
      question: "Un numéro de téléphone si un échange rapide est plus simple ?",
      input: "phone",
      friction: 2,
      optional: true,
    });
  }

  return {
    schemaVersion: 1,
    goal: settings.goal,
    phases: [
      { key: "besoin", label: "Votre besoin" },
      { key: "projet", label: "Votre projet" },
      { key: "details", label: "Derniers détails" },
      { key: "contact", label: "Coordonnées" },
    ],
    fields,
    questions,
    completionThreshold: 1,
    minimumContactFields: ["email"],
    maxQuestions: 8,
    maxClarifications: 2,
    intro: {
      title: "Commençons simplement.",
      prompt: settings.introPrompt || "De quoi avez-vous besoin ?",
      placeholder: "Expliquez votre situation avec vos propres mots…",
    },
    completion: {
      title: "Votre demande est prête.",
      body: settings.completionBody || defaultSettings.completionBody,
    },
    consentLabel:
      "J’accepte que ces informations soient transmises à l’entreprise afin de traiter ma demande.",
  };
}

/** Règles de qualification dérivées des mêmes réglages : aucune valeur inventée. */
export function buildQualificationRules(settings: ExperienceSettings): QualificationRules {
  const timelines = settings.timelines.length > 0 ? settings.timelines : [...defaultTimelines];
  return {
    ruleVersion: 1,
    weights: { fit: 0.35, intent: 0.3, urgency: 0.15, completeness: 0.2 },
    supportedServices: [...settings.services],
    serviceAreas: [...settings.serviceAreas],
    urgentTimelines: timelines.slice(0, 3),
    disqualifiers: [],
    thresholds: { highPriority: 80, standard: 55, minCompleteness: 60 },
  };
}
