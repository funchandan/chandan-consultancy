"use client";

import { useCallback, useMemo, useState } from "react";

import { PollWidget } from "@/components/ui/poll-widget";
import {
  BENTO_POLL_STORAGE_KEY,
  DEFAULT_BENTO_POLL,
  type BentoPollConfig,
  type BentoPollOption,
} from "@/lib/bento-poll";
import { cn } from "@/lib/utils";

/** Inline poll bento — Cult UI PollWidget SSOT; static port: assets/wp-bento-poll-widget.* */
export function PollBentoCard({
  className,
  poll = DEFAULT_BENTO_POLL,
}: {
  className?: string;
  poll?: BentoPollConfig;
}) {
  const seedVotes = useMemo(
    () => ({ ...(poll.votes ?? {}) }),
    [poll.votes]
  );

  const [votes, setVotes] = useState<Record<string, number>>(seedVotes);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(BENTO_POLL_STORAGE_KEY);
      if (!raw) return window.localStorage.getItem("wp-bento-poll-voted") === "1";
      return !!JSON.parse(raw).hasVoted;
    } catch {
      return false;
    }
  });

  const onVote = useCallback((selectedIds: string[]) => {
    setVotes((prev) => {
      const next = { ...prev };
      for (const id of selectedIds) {
        next[id] = (next[id] ?? 0) + 1;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          BENTO_POLL_STORAGE_KEY,
          JSON.stringify({
            hasVoted: true,
            selected: selectedIds[0],
            votes: next,
          })
        );
      }
      return next;
    });
    setHasVoted(true);
  }, []);

  const options: BentoPollOption[] = poll.options;

  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col overflow-hidden rounded-xl lg:col-span-1",
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        className
      )}
      data-hero-bento-poll
    >
      <div className="flex h-full min-h-0 flex-col p-[1.125rem]">
        <PollWidget
          question={poll.question}
          description={poll.description}
          options={options}
          votes={votes}
          hasVoted={hasVoted}
          onVote={onVote}
          mode="inline"
          autoCollapseDelay={2500}
          successDuration={1500}
        >
          <PollWidget.Content className="min-h-0 flex-1 gap-2.5">
            <PollWidget.Question />
            <PollWidget.Options className="gap-1.5">
              {options.map((opt) => (
                <PollWidget.Option
                  key={opt.id}
                  value={opt.id}
                  className="p-2.5 text-[0.8125rem]"
                >
                  <PollWidget.Indicator />
                  <PollWidget.Label>{opt.label}</PollWidget.Label>
                  <PollWidget.Percentage />
                </PollWidget.Option>
              ))}
            </PollWidget.Options>
            <PollWidget.Results />
            <PollWidget.Submit className="h-9 text-sm">
              Submit vote
            </PollWidget.Submit>
          </PollWidget.Content>
        </PollWidget>
      </div>
    </div>
  );
}
