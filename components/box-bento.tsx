"use client";

import type { ReactNode } from "react";
import { PollBentoCard } from "@/components/poll-bento-card";
import { ReviewsBentoCard } from "@/components/reviews-bento-card";
import { FileTextIcon } from "@radix-ui/react-icons";

import { BentoToolkitTerminalBg } from "@/components/bento-toolkit-terminal-bg";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

/**
 * BoxBento — WO-023 React SSOT.
 * Static index.html brownfield port: assets/wp-box-bento.{css,js}
 */
export function BoxBento({
  searchSlot,
  className,
}: {
  searchSlot: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("wp-box-bento", className)} data-box-bento>
      <BentoGrid>
        <div
          className="col-span-3 flex min-h-0 flex-col justify-stretch rounded-xl"
          data-box-bento-search
        >
          {searchSlot}
        </div>
        <BentoCard
          name="Toolkits"
          accentIndex={0}
          description="Decision teardowns, research scaffolds, and ship-ready frameworks."
          href="toolkits.html"
          cta="Explore toolkits"
          Icon={FileTextIcon}
          className="col-span-3 lg:col-span-2"
          background={
            <div
              className="bento-bg-toolkit absolute inset-0"
              data-bento-bg-toolkit
              aria-hidden
            >
              <BentoToolkitTerminalBg />
            </div>
          }
        />
        <PollBentoCard className="col-span-3 lg:col-span-1" />
        <ReviewsBentoCard className="col-span-3" />
      </BentoGrid>
    </div>
  );
}
