"use client"

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type AnimatedTestimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

function randomRotateY() {
  return Math.floor(Math.random() * 21) - 10
}

function QuoteWords({
  quote,
  active,
  embedded,
}: {
  quote: string
  active: number
  embedded: boolean
}) {
  if (!embedded) {
    return (
      <>
        {quote.split(" ").map((word, index) => (
          <motion.span
            key={`${active}-${index}`}
            initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              delay: 0.02 * index,
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </>
    )
  }

  return (
    <>
      {quote.split(" ").map((word, index) => (
        <motion.span
          key={`${active}-${index}`}
          initial={{ filter: "blur(6px)", opacity: 0, y: 4 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{
            duration: 0.18,
            ease: "easeInOut",
            delay: 0.015 * index,
          }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  )
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
  embedded = false,
  className,
}: {
  testimonials: AnimatedTestimonial[]
  autoplay?: boolean
  /** Bento panel — Aceternity dark stack + word blur at ledge scale */
  embedded?: boolean
  className?: string
}) {
  const [active, setActive] = useState(0)
  const count = testimonials.length

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % count)
  }, [count])

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + count) % count)
  }, [count])

  const isActive = (index: number) => index === active

  useEffect(() => {
    if (!autoplay || count < 2) return
    const interval = window.setInterval(handleNext, 5000)
    return () => window.clearInterval(interval)
  }, [autoplay, count, handleNext])

  if (!count) return null

  const current = testimonials[active]

  return (
    <div
      className={cn(
        "font-sans antialiased",
        embedded
          ? "w-full max-w-none rounded-xl bg-neutral-950 p-4 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
          : "mx-auto max-w-sm px-4 py-20 md:max-w-4xl md:px-8 lg:px-12",
        className
      )}
      data-bento-animated-testimonials
      data-embedded={embedded ? "true" : undefined}
    >
      <div
        className={cn(
          "relative grid",
          embedded
            ? "grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(7.5rem,38%)_1fr] sm:gap-6"
            : "grid-cols-1 gap-20 md:grid-cols-2"
        )}
      >
        <div className={cn(embedded && "min-h-[9rem] sm:min-h-[10rem]")}>
          <div
            className={cn(
              "relative w-full",
              embedded ? "h-36 sm:h-40" : "h-80"
            )}
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + testimonial.name}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.65,
                    scale: isActive(index) ? 1 : 0.94,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : count + 2 - index,
                    y: isActive(index) ? (embedded ? [0, -10, 0] : [0, -80, 0]) : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className={cn(
                      "h-full w-full border border-white/10 object-cover object-center",
                      embedded ? "rounded-2xl" : "rounded-3xl"
                    )}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-col",
            embedded ? "justify-between gap-3 py-1" : "justify-between py-4"
          )}
        >
          <motion.div
            key={active}
            initial={{ y: embedded ? 10 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: embedded ? -10 : -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3
              className={cn(
                "font-bold",
                embedded
                  ? "text-base text-white sm:text-lg"
                  : "text-2xl text-black dark:text-white"
              )}
            >
              {current.name}
            </h3>
            <p
              className={cn(
                embedded
                  ? "text-xs text-neutral-500 sm:text-sm"
                  : "text-sm text-gray-500 dark:text-neutral-500"
              )}
            >
              {current.designation}
            </p>
            <motion.p
              className={cn(
                embedded
                  ? "mt-3 text-sm leading-snug text-neutral-300 sm:text-[0.9375rem]"
                  : "mt-8 text-lg text-gray-500 dark:text-neutral-300"
              )}
            >
              <QuoteWords
                quote={current.quote}
                active={active}
                embedded={embedded}
              />
            </motion.p>
          </motion.div>

          {count > 1 ? (
            <div
              className={cn(
                "flex gap-2",
                embedded ? "pt-2" : "gap-4 pt-12 md:pt-0"
              )}
            >
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className={cn(
                  "group/button flex items-center justify-center rounded-full",
                  embedded
                    ? "h-7 w-7 bg-neutral-800"
                    : "h-7 w-7 bg-gray-100 dark:bg-neutral-800"
                )}
              >
                <IconArrowLeft
                  className={cn(
                    "transition-transform duration-300 group-hover/button:rotate-12",
                    embedded
                      ? "h-4 w-4 text-neutral-400"
                      : "h-5 w-5 text-black dark:text-neutral-400"
                  )}
                />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className={cn(
                  "group/button flex items-center justify-center rounded-full",
                  embedded
                    ? "h-7 w-7 bg-neutral-800"
                    : "h-7 w-7 bg-gray-100 dark:bg-neutral-800"
                )}
              >
                <IconArrowRight
                  className={cn(
                    "transition-transform duration-300 group-hover/button:-rotate-12",
                    embedded
                      ? "h-4 w-4 text-neutral-400"
                      : "h-5 w-5 text-black dark:text-neutral-400"
                  )}
                />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
