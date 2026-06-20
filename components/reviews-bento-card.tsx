"use client"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import {
  DEFAULT_BENTO_TESTIMONIALS,
  withAvatarUrls,
  type BentoTestimonialInput,
} from "@/lib/bento-testimonials"
import { cn } from "@/lib/utils"

/** Reviews row — Aceternity embedded panel only; static: assets/wp-bento-testimonial-box.* */
export function ReviewsBentoCard({
  className,
  testimonials = DEFAULT_BENTO_TESTIMONIALS,
}: {
  className?: string
  testimonials?: BentoTestimonialInput[]
}) {
  const resolved = withAvatarUrls(testimonials)

  return (
    <div
      className={cn("bento-reviews-embed col-span-3", className)}
      data-hero-bento-reviews-card
    >
      <div
        className="bento-animated-testimonials-shell"
        data-bento-bg-artifact="testimonial-box"
        data-hero-bento-reviews
      >
        <AnimatedTestimonials testimonials={resolved} autoplay embedded />
      </div>
    </div>
  )
}
