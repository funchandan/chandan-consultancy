export type BentoQuizItem = {
  id: string;
  text: string;
  rationale: string;
};

export type BentoQuizConfig = {
  eyebrow?: string;
  title: string;
  description: string;
  hint?: string;
  items: BentoQuizItem[];
  /** Canonical priority — most important first */
  expertOrder: string[];
  startOrder?: string[];
  caseHref: string;
  caseCta: string;
};

export const BENTO_QUIZ_STORAGE_KEY = "wp-bento-quiz-state";

export const DEFAULT_BENTO_QUIZ: BentoQuizConfig = {
  eyebrow: "Test yourself!",
  title: "What matters when building your website?",
  description: "Who said learning cannot be engaging?",
  hint: "Drag to rank · most critical first",
  items: [
    {
      id: "map-journey",
      text: "Map earn/spend journeys (US + IN)",
      rationale: "One clear story before marketplace UI scales.",
    },
    {
      id: "align-metric",
      text: "One north-star metric with product + GTM",
      rationale: "Shared success measure before surface debates.",
    },
    {
      id: "moderated-test",
      text: "Moderated tests on production stimulus",
      rationale: "Validate with real learners in US + India.",
    },
    {
      id: "marketplace",
      text: "Marketplace mechanics + edge cases",
      rationale: "Earn/spend rules need defensible boundaries.",
    },
    {
      id: "avatar",
      text: "Avatar rewards as a fast follow",
      rationale: "Delight layer after the core loop works.",
    },
  ],
  expertOrder: [
    "map-journey",
    "align-metric",
    "moderated-test",
    "marketplace",
    "avatar",
  ],
  caseHref: "#connect",
  caseCta: "Get your free web presence audit today",
};

/** Deliberately non-expert starting order for the drag challenge */
export const DEFAULT_BENTO_QUIZ_START_ORDER = [
  "avatar",
  "marketplace",
  "moderated-test",
  "align-metric",
  "map-journey",
];

export function orderItems(
  items: BentoQuizItem[],
  order: string[]
): BentoQuizItem[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return order
    .map((id) => byId.get(id))
    .filter((item): item is BentoQuizItem => !!item);
}

export function scoreRanking(userOrder: string[], expertOrder: string[]): number {
  let matches = 0;
  for (let i = 0; i < expertOrder.length; i++) {
    if (userOrder[i] === expertOrder[i]) matches++;
  }
  return matches;
}
