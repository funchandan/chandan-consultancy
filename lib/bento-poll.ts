export type BentoPollOption = {
  id: string;
  label: string;
  description?: string;
};

export type BentoPollConfig = {
  question: string;
  description?: string;
  options: BentoPollOption[];
  votes?: Record<string, number>;
};

export const DEFAULT_BENTO_POLL: BentoPollConfig = {
  question: "What would you like to see more of?",
  description: "Pick one, then submit.",
  options: [
    { id: "cases", label: "Case study deep dives" },
    { id: "toolkits", label: "Design toolkits" },
    { id: "ai", label: "AI product UX" },
    { id: "process", label: "Design process notes" },
  ],
  votes: { cases: 12, toolkits: 8, ai: 15, process: 5 },
};

export const BENTO_POLL_STORAGE_KEY = "wp-bento-poll-state";
