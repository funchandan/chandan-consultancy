"use client"

import { useRef } from "react"
import { useInView } from "motion/react"

import { AuroraText } from "@/components/ui/aurora-text"
import { cn } from "@/lib/utils"

export interface BentoCardTitleProps {
  text: string
  /** Word index that receives Aurora fill; defaults to last word */
  accentIndex?: number
  className?: string
}

export function BentoCardTitle({
  text,
  accentIndex,
  className,
}: BentoCardTitleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const words = text.trim().split(/\s+/).filter(Boolean)
  const accentIdx =
    accentIndex != null ? accentIndex : Math.max(0, words.length - 1)

  return (
    <span
      ref={ref}
      className={cn(
        "wp-bento-title-reveal inline-flex flex-wrap",
        isInView && "is-revealed",
        className
      )}
      data-bento-title-reveal
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="wp-bento-title-reveal__word relative mx-0.5 inline-block first:ms-0 lg:mx-1.5"
          style={{ "--bento-word-i": i } as React.CSSProperties}
        >
          <span
            className="wp-bento-title-reveal__ghost opacity-30"
            aria-hidden="true"
          >
            {word}
          </span>
          <span
            className={cn(
              "wp-bento-title-reveal__fill absolute inset-0 opacity-0 transition-opacity duration-500 ease-out",
              isInView && "opacity-100"
            )}
            style={{
              transitionDelay: `${i * 140}ms`,
            }}
          >
            {i === accentIdx ? (
              <AuroraText>{word}</AuroraText>
            ) : (
              <span className="text-neutral-900">{word}</span>
            )}
          </span>
        </span>
      ))}
    </span>
  )
}
