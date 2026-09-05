/**
 * Configuration produit centralisée.
 * Le nom de marque et les libellés publics sont modifiables ici sans toucher aux vues.
 */
export const product = {
  name: "Relay",
  tagline: "Dites ce qu’il vous faut. Relay structure la suite.",
  mission: "Rendre la communication avec une entreprise aussi simple qu’expliquer son besoin.",
  summary:
    "Relay remplace les formulaires statiques par des parcours d’intake adaptatifs : une question utile à la fois, et une demande structurée à l’arrivée.",
} as const;

export const demoConfig = {
  experienceSlug: "geolia-demo",
  organizationName: "GeoLia — démonstration",
  badge: "Démonstration",
  referenceSentence:
    "Je voudrais faire borner mon terrain au 23 rue X à Waterloo avant de poser une clôture le mois prochain.",
} as const;

/**
 * Identité légale : à compléter par l'entreprise.
 * Tant qu'une valeur est nulle, les pages juridiques affichent un avertissement.
 */
export const legalEntity = {
  companyName: null as string | null,
  registrationNumber: null as string | null,
  address: null as string | null,
  contactEmail: null as string | null,
  dataController: null as string | null,
  retentionMonths: null as number | null,
} as const;

export const legalIsComplete = Object.values(legalEntity).every((value) => value !== null);

export const appNav = [
  { to: "/app/inbox", label: "Inbox" },
  { to: "/app/experiences", label: "Expériences" },
  { to: "/app/knowledge", label: "Knowledge" },
  { to: "/app/analytics", label: "Analytics" },
  { to: "/app/settings", label: "Paramètres" },
] as const;

export const industries = [
  "Agences",
  "Architectes et géomètres",
  "Construction",
  "Immobilier",
  "Conseil",
  "Services spécialisés",
] as const;

export const leadStatusLabels: Record<string, string> = {
  new: "Nouveau",
  to_contact: "À contacter",
  qualified: "Qualifié",
  not_a_fit: "Hors cible",
  done: "Traité",
};

export const recommendedActionLabels: Record<string, string> = {
  high_priority_contact: "Contacter en priorité",
  standard_follow_up: "Suivi standard",
  request_missing_information: "Demander les informations manquantes",
  not_a_fit: "Hors cible",
};
