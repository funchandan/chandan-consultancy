"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import type { BentoTestimonial } from "@/lib/bento-testimonials"
import { cn } from "@/lib/utils"

function randomRotateY() {
  return Math.floor(Math.random() * 21) - 10
}

/** Compact AnimatedTestimonials embed for bento reviews — no nav chrome */
export function BentoTestimonialBox({
  testimonials,
  autoplay = true,
  className,
  decorative = false,
}: {
  testimonials: BentoTestimonial[]
  autoplay?: boolean
  className?: string
  /** When true, hide from assistive tech (e.g. decorative pin lift) */
  decorative?: boolean
}) {
  const [active, setActive] = useState(0)
  const items = testimonials.length ? testimonials : []

  useEffect(() => {
    if (!autoplay || items.length < 2) return
    const interval = window.setInterval(() => {
      setActive((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [autoplay, items.length])

  if (!items.length) return null

  const current = items[active]

  return (
    <div
      className={cn(
        "bento-testimonial-box pointer-events-none grid w-[18rem] grid-cols-[5.5rem_1fr] gap-3 font-sans antialiased",
        className
      )}
      data-bento-bg-artifact="testimonial-box"
      aria-hidden={decorative ? true : undefined}
    >
      <div className="relative h-24 w-full">
        <AnimatePresence>
          {items.map((testimonial, index) => (
            <motion.div
              key={testimonial.src + testimonial.name}
              initial={{
                opacity: 0,
                scale: 0.9,
                rotate: randomRotateY(),
              }}
              animate={{
                opacity: index === active ? 1 : 0.65,
                scale: index === active ? 1 : 0.92,
                rotate: index === active ? 0 : randomRotateY(),
                zIndex: index === active ? 10 : items.length - index,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0 origin-bottom"
            >
              <img
                src={testimonial.src}
                alt=""
                width={120}
                height={120}
                draggable={false}
                className="h-full w-full rounded-2xl border border-white/10 bg-neutral-900 object-cover object-center"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex min-w-0 flex-col justify-center py-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <p className="truncate text-sm font-semibold text-white">
              {current.name}
            </p>
            <p className="truncate text-[0.65rem] text-neutral-400">
              {current.designation}
            </p>
            <p className="mt-2 line-clamp-4 text-[0.68rem] leading-snug text-neutral-300">
              {current.quote}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
