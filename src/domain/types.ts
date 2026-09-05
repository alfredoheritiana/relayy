/** Modèle de domaine du moteur adaptatif Relay. Aucune dépendance UI ou réseau. */

export type FieldType =
  | "text"
  | "longtext"
  | "choice"
  | "multichoice"
  | "address"
  | "budget"
  | "date"
  | "email"
  | "phone";

export type ValueSource = "explicit" | "extracted_high" | "extracted_low" | "corrected";

export interface Choice {
  readonly value: string;
  readonly label: string;
}

export interface PhaseDefinition {
  readonly key: string;
  readonly label: string;
}

export interface FieldDefinition {
  readonly key: string;
  readonly label: string;
  readonly type: FieldType;
  readonly required: boolean;
  /** Un champ sensible ne peut jamais être satisfait par inférence. */
  readonly sensitive: boolean;
  readonly inferable: boolean;
  readonly phase: string;
  /** Valeur métier 1..5, utilisée pour classer les questions. */
  readonly weight: number;
  readonly choices?: readonly Choice[];
}

export interface QuestionCandidate {
  readonly key: string;
  readonly phase: string;
  readonly targets: readonly string[];
  readonly question: string;
  readonly reason?: string;
  readonly placeholder?: string;
  readonly input: FieldType;
  readonly choices?: readonly Choice[];
  /** Coût de friction estimé 1..5 : plus c'est bas, plus la question est facile. */
  readonly friction: number;
  readonly opening?: boolean;
  readonly optional?: boolean;
}

export interface ExperienceDefinition {
  readonly schemaVersion: number;
  readonly goal: string;
  readonly phases: readonly PhaseDefinition[];
  readonly fields: readonly FieldDefinition[];
  readonly questions: readonly QuestionCandidate[];
  /** Ratio 0..1 de champs requis acceptés nécessaire pour passer en récapitulatif. */
  readonly completionThreshold: number;
  readonly minimumContactFields: readonly string[];
  readonly maxQuestions: number;
  readonly maxClarifications: number;
  readonly intro: { readonly title: string; readonly prompt: string; readonly placeholder: string };
  readonly completion: { readonly title: string; readonly body: string };
  readonly consentLabel: string;
}

export type FieldValue = string | readonly string[];

export interface SessionValue {
  readonly fieldKey: string;
  readonly value: FieldValue;
  readonly source: ValueSource;
  readonly confidence: number | null;
  readonly sourceMessageId?: string | null;
}

export type ScoreDimension = "fit" | "intent" | "urgency" | "completeness";

export interface ScoreReason {
  readonly ruleId: string;
  readonly reason: string;
  readonly signal: string;
  readonly sourceField: string | null;
  readonly contribution: "positive" | "negative" | "neutral";
}

export interface DimensionScore {
  readonly dimension: ScoreDimension;
  /** null = données insuffisantes : aucun score n'est inventé. */
  readonly score: number | null;
  readonly reasons: readonly ScoreReason[];
}

export type RecommendedAction =
  | "high_priority_contact"
  | "standard_follow_up"
  | "request_missing_information"
  | "not_a_fit";

export interface Disqualifier {
  readonly id: string;
  readonly label: string;
  readonly fieldKey: string;
  readonly values: readonly string[];
}

export interface QualificationRules {
  readonly ruleVersion: number;
  readonly weights: Record<ScoreDimension, number>;
  readonly supportedServices: readonly string[];
  readonly serviceAreas: readonly string[];
  readonly urgentTimelines: readonly string[];
  readonly disqualifiers: readonly Disqualifier[];
  readonly thresholds: {
    readonly highPriority: number;
    readonly standard: number;
    readonly minCompleteness: number;
  };
}

export interface QualificationResult {
  readonly dimensions: readonly DimensionScore[];
  readonly overallScore: number | null;
  readonly recommendedAction: RecommendedAction;
  readonly missingFields: readonly string[];
  readonly completeness: number;
}

export type NextStep =
  | { readonly kind: "question"; readonly question: QuestionCandidate }
  | { readonly kind: "clarification"; readonly question: QuestionCandidate }
  | { readonly kind: "review" }
  | { readonly kind: "max_questions_reached"; readonly missingFields: readonly string[] };

export interface PhaseProgress {
  readonly key: string;
  readonly label: string;
  readonly state: "done" | "current" | "upcoming";
}

export interface Extraction {
  readonly fieldKey: string;
  readonly value: FieldValue;
  readonly confidence: number;
  readonly evidence: string;
}

export interface InterpretationProposal {
  readonly extractions: readonly Extraction[];
  readonly contradictions: readonly string[];
  readonly clarificationNeeded: string | null;
  readonly provider: "ai" | "deterministic";
}
