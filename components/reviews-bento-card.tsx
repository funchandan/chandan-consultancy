"use client"

import { ArrowRightIcon, BellIcon } from "@radix-ui/react-icons"

import { BentoTestimonialBox } from "@/components/bento-testimonial-box"
import { BentoCardTitle } from "@/components/bento-card-title"
import { PinContainer } from "@/components/ui/3d-pin"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_BENTO_TESTIMONIALS,
  withAvatarUrls,
  type BentoTestimonialInput,
} from "@/lib/bento-testimonials"
import { cn } from "@/lib/utils"

/** My reviews bento — testimonial-box + 3D pin; static port: assets/wp-bento-testimonial-box.* */
export function ReviewsBentoCard({
  className,
  name = "My reviews",
  accentIndex = 1,
  description = "What collaborators say about working together.",
  href = "about.html",
  cta = "Read more",
  testimonials = DEFAULT_BENTO_TESTIMONIALS,
}: {
  className?: string
  name?: string
  accentIndex?: number
  description?: string
  href?: string
  cta?: string
  testimonials?: BentoTestimonialInput[]
}) {
  const resolved = withAvatarUrls(testimonials)

  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-visible rounded-xl",
        "origin-bottom transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
        "lg:hover:[transform:perspective(1100px)_rotateX(65deg)] lg:hover:z-[3]",
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        className
      )}
      data-hero-bento-reviews-card
      data-bento-3d-pin
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-visible opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <PinContainer
          title={cta}
          href={href}
          containerClassName="absolute inset-0 h-full w-full scale-[1.35] origin-center"
          className="w-full"
        >
          <BentoTestimonialBox testimonials={resolved} autoplay />
        </PinContainer>
      </div>

      <div className="relative z-10 p-[1.125rem]">
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-4 transition-all duration-300 lg:group-hover:translate-y-0">
          <BellIcon className="h-[2.4rem] w-[2.4rem] origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
          <h3 className="bento-card__title text-[1.35rem] font-semibold leading-tight text-neutral-900">
            <BentoCardTitle text={name} accentIndex={accentIndex} />
          </h3>
          <p className="max-w-lg text-[0.975rem] leading-snug text-neutral-600">
            {description}
          </p>
        </div>

        <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 lg:hidden">
          <Button
            variant="link"
            size="sm"
            className="pointer-events-auto p-0 text-[1.05rem]"
            render={<a href={href} />}
            nativeButton={false}
          >
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 z-10 hidden w-full translate-y-[1.875rem] transform-gpu flex-row items-center p-[1.125rem] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
        <Button
          variant="link"
          size="sm"
          className="pointer-events-auto p-0"
          render={<a href={href} />}
          nativeButton={false}
        >
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3" />
    </div>
  )
}
