export type AssociativeObject = { [key: string]: unknown };

export type GPTResult = { data: AssociativeObject; notes: string; content: string };

export type Context = AssociativeObject & {
  history: ContextHistory[];
  passed: boolean;
};

export type ContextHistory = {
  type: string;
  output: AssociativeObject | BooleanOutcome | DataOutcome;
};

export type Outcome = {
  metadata: OutcomeMetadata | null;
};

export type BooleanOutcome = Outcome & {
  outcome: boolean;
};

export type DataOutcome = Outcome & {
  data: unknown;
};

export type OutcomeMetadata = AssociativeObject & {
  data?: AssociativeObject & {
    assessments?: AssociativeObject[];
  };
  comment?: string;
};
