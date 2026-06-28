export type BentoQuizItem = {
  id: string;
  text: string;
  rationale: string;
};

export type BentoQuizConfig = {
  title: string;
  description: string;
  items: BentoQuizItem[];
  /** Canonical priority — most important first */
  expertOrder: string[];
  caseHref: string;
  caseCta: string;
};

export const BENTO_QUIZ_STORAGE_KEY = "wp-bento-quiz-state";

export const DEFAULT_BENTO_QUIZ: BentoQuizConfig = {
  title: "Test your systems instinct",
  description:
    "Rank these moves for a 20M+ learner loyalty launch — most critical first.",
  items: [
    {
      id: "map-journey",
      text: "Map earn-and-spend journeys end to end",
      rationale: "One clear story before marketplace UI scales.",
    },
    {
      id: "align-metric",
      text: "Align stakeholders on one north-star metric",
      rationale: "Shared success measure before surface debates.",
    },
    {
      id: "moderated-test",
      text: "Run moderated tests on production stimulus",
      rationale: "Validate with real learners in US + India.",
    },
    {
      id: "marketplace",
      text: "Define marketplace mechanics and edge cases",
      rationale: "Earn/spend rules need defensible boundaries.",
    },
    {
      id: "avatar",
      text: "Ship avatar rewards as a fast follow",
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
  caseHref: "#work",
  caseCta: "See the BYJU's case",
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
