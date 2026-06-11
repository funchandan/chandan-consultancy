"use client";

import type { ComponentProps } from "react";

import { Pointer } from "@/components/ui/pointer";

import { cn } from "@/lib/utils";

type BluePointerProps = ComponentProps<typeof Pointer>;

/** Scoped blue pointer — add inside any hover target (Magic UI colored variant). */
export function BluePointer({ className, ...props }: BluePointerProps) {
  return (
    <Pointer
      className={cn("fill-blue-500 text-blue-500 stroke-white", className)}
      {...props}
    />
  );
}
