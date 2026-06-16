import { avatarUrl } from "@/lib/avatar-url"

export type BentoTestimonialInput = {
  quote: string
  name: string
  designation: string
  src?: string
}

export type BentoTestimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

export const DEFAULT_BENTO_TESTIMONIALS: BentoTestimonialInput[] = [
  {
    quote:
      "Chandan's design perception is well ahead of what I could imagine as a business leader. I like his approach very much.",
    name: "Spencer W.",
    designation: "Fortune 100 VP-Product",
  },
  {
    quote:
      "Chandan is great at baking user voice into product solutions which ultimately create delightful users",
    name: "Prachi",
    designation: "Head of UX, Byju's",
  },
  {
    quote:
      "I have worked on multiple projects with Chandan and I often been impressed by his ability to present his findings back in an nstructive way that provides thoughtful guidance.",
    name: "Co-worker",
    designation: "Byju's",
  },
]

export function withAvatarUrls(
  items: BentoTestimonialInput[]
): BentoTestimonial[] {
  return items.map((item) => ({
    quote: item.quote,
    name: item.name,
    designation: item.designation,
    src: item.src ?? avatarUrl(item.name),
  }))
}

export function normalizeTestimonialQuotes(
  quotes: Array<Record<string, string | undefined>> | undefined
): BentoTestimonial[] {
  if (!quotes?.length) return withAvatarUrls(DEFAULT_BENTO_TESTIMONIALS)

  return withAvatarUrls(
    quotes.map((q) => ({
      quote: q.quote ?? q.text ?? "",
      name: q.name ?? "Collaborator",
      designation: q.designation ?? q.cite ?? "",
      src: q.src,
    }))
  )
}
