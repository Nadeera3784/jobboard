export interface AssociativeObject {
  [key: string]: unknown;
}

export interface GPTResult {
  data: AssociativeObject;
  notes: string;
  content: string;
}

export interface Context extends AssociativeObject {
  history: ContextHistory[];
  passed: boolean;
}

export interface ContextHistory {
  type: string;
  output: AssociativeObject | BooleanOutcome | DataOutcome;
}

export interface Outcome {
  metadata: OutcomeMetadata | null;
}

export interface BooleanOutcome extends Outcome {
  outcome: boolean;
}

export interface DataOutcome extends Outcome {
  data: unknown;
}

export interface OutcomeMetadata extends AssociativeObject {
  data?: AssociativeObject & {
    assessments?: AssociativeObject[];
  };
  comment?: string;
}
