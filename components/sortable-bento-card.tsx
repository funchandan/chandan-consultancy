"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGroup, Reorder, useDragControls } from "motion/react";
import { GripVertical } from "lucide-react";

import {
  BENTO_QUIZ_STORAGE_KEY,
  DEFAULT_BENTO_QUIZ,
  DEFAULT_BENTO_QUIZ_START_ORDER,
  orderItems,
  scoreRanking,
  type BentoQuizConfig,
  type BentoQuizItem,
} from "@/lib/bento-quiz";
import { cn } from "@/lib/utils";

type QuizItemState = BentoQuizItem & { key: string };

function QuizSortableRow({
  item,
  rank,
  locked,
}: {
  item: QuizItemState;
  rank: number;
  locked: boolean;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={!locked}
      dragControls={dragControls}
      className={cn(
        "bento-quiz__row",
        locked && "bento-quiz__row--locked"
      )}
      whileDrag={{ scale: 1.02, zIndex: 20 }}
    >
      <span className="bento-quiz__rank" aria-hidden="true">
        {rank}
      </span>
      <span className="bento-quiz__label">{item.text}</span>
      <button
        type="button"
        className="bento-quiz__handle"
        aria-label={`Drag to reorder: ${item.text}`}
        disabled={locked}
        onPointerDown={(event) => dragControls.start(event)}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
    </Reorder.Item>
  );
}

/** Sortable quiz bento — Cult UI SortableList pattern; static: assets/wp-bento-sortable-quiz.* */
export function SortableBentoCard({
  className,
  quiz = DEFAULT_BENTO_QUIZ,
}: {
  className?: string;
  quiz?: BentoQuizConfig;
}) {
  const initialItems = useMemo(
    () =>
      orderItems(quiz.items, DEFAULT_BENTO_QUIZ_START_ORDER).map((item) => ({
        ...item,
        key: item.id,
      })),
    [quiz.items]
  );

  const [items, setItems] = useState<QuizItemState[]>(initialItems);
  const [dirty, setDirty] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BENTO_QUIZ_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as {
        completed?: boolean;
        score?: number;
      };
      if (stored.completed) {
        setCompleted(true);
        if (typeof stored.score === "number") setScore(stored.score);
      }
    } catch {
      /* no-op */
    }
  }, []);

  const onReorder = useCallback((next: QuizItemState[]) => {
    setItems(next);
    setDirty(true);
  }, []);

  const onSubmit = useCallback(() => {
    const userOrder = items.map((item) => item.id);
    const nextScore = scoreRanking(userOrder, quiz.expertOrder);
    setScore(nextScore);
    setCompleted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        BENTO_QUIZ_STORAGE_KEY,
        JSON.stringify({ completed: true, order: userOrder, score: nextScore })
      );
    }
  }, [items, quiz.expertOrder]);

  const expertItems = useMemo(
    () => orderItems(quiz.items, quiz.expertOrder),
    [quiz.expertOrder, quiz.items]
  );

  return (
    <div
      className={cn(
        "group bento-card bento-card--quiz relative col-span-3 flex flex-col overflow-hidden rounded-xl lg:col-span-1",
        className
      )}
      data-hero-bento-quiz
    >
      <div className="bento-card__panel bento-card__panel--quiz flex h-full min-h-0 flex-col">
        <div
          className="bento-quiz-mount"
          data-bento-quiz-widget
          aria-live="polite"
        >
          {completed ? (
            <div className="bento-quiz bento-quiz--results" data-bento-quiz-root>
              <div className="bento-quiz__header">
                <h3 className="bento-quiz__title">{quiz.title}</h3>
                <p className="bento-quiz__desc">
                  {score !== null
                    ? `${score} of ${quiz.expertOrder.length} in the expert sequence.`
                    : "Expert priority order:"}
                </p>
              </div>
              <ol className="bento-quiz__results" data-bento-quiz-results>
                {expertItems.map((item, index) => (
                  <li key={item.id} className="bento-quiz__result">
                    <span className="bento-quiz__rank">{index + 1}</span>
                    <div className="bento-quiz__result-copy">
                      <span className="bento-quiz__label">{item.text}</span>
                      <span className="bento-quiz__rationale">{item.rationale}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <a className="bento-quiz__cta" href={quiz.caseHref}>
                {quiz.caseCta}
              </a>
            </div>
          ) : (
            <div className="bento-quiz" data-bento-quiz-root>
              <div className="bento-quiz__header">
                <h3 className="bento-quiz__title">{quiz.title}</h3>
                <p className="bento-quiz__desc">{quiz.description}</p>
              </div>
              <LayoutGroup>
                <Reorder.Group
                  axis="y"
                  values={items}
                  onReorder={onReorder}
                  className="bento-quiz__list"
                  data-bento-quiz-list
                >
                  {items.map((item, index) => (
                    <QuizSortableRow
                      key={item.key}
                      item={item}
                      rank={index + 1}
                      locked={false}
                    />
                  ))}
                </Reorder.Group>
              </LayoutGroup>
              <button
                type="button"
                className="bento-quiz__submit"
                disabled={!dirty}
                onClick={onSubmit}
              >
                Check my ranking
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bento-card__shade" aria-hidden="true" />
    </div>
  );
}
