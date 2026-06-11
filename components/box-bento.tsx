"use client";

import type { ReactNode } from "react";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

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
          description="Decision teardowns, research scaffolds, and ship-ready frameworks."
          href="toolkits.html"
          cta="Explore toolkits"
          Icon={FileTextIcon}
          className="col-span-3 lg:col-span-2"
          background={<div className="absolute inset-0 bg-neutral-100/80" />}
        />
        <BentoCard
          name="My experience"
          description="Birlasoft · Senior UX Consultant — Stryker and HP field service AI."
          href="about.html#experience"
          cta="See timeline"
          Icon={CalendarIcon}
          className="col-span-3 lg:col-span-1"
          background={<div className="absolute inset-0 bg-neutral-100/60" />}
        />
        <BentoCard
          name="My reviews"
          description="What collaborators say about working together."
          href="about.html"
          cta="Read more"
          Icon={BellIcon}
          className="col-span-3"
          background={<div className="absolute inset-0 bg-neutral-100/60" />}
        />
      </BentoGrid>
    </div>
  );
}
