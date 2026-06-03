# Product Design Reference

## What interviewers are actually testing

At Director / Senior PM level, product design questions test three things:
1. **Judgment** — can you make a defensible call under ambiguity?
2. **User empathy** — do your decisions connect to real human needs, or are they abstract?
3. **Systems thinking** — do you see the ecosystem beyond the single feature?

They are NOT testing whether you have the "right" answer. There is no right answer. They are testing whether you can think clearly and explain your reasoning.

---

## Decomposition patterns

### Consumer product (app, feed, marketplace)
Break into: Discovery → Engagement → Conversion → Retention → Virality
Ask: where does the user drop off? What's the core loop?

### Enterprise / B2B product
Break into: Onboarding → Core workflow → Collaboration → Administration → Reporting
Ask: who is the buyer vs. the user? What does the admin need vs. the end user?

### Platform / API product
Break into: Developer onboarding → Core capability → Extension points → Observability
Ask: who builds on this? What makes them successful?

### 0→1 product (greenfield)
Break into: Problem validation → MVP definition → Distribution → Monetisation
Ask: what's the riskiest assumption? What do you need to test first?

---

## Strong decomposition signals

- You name the **critical path** (the flow that must work for the product to have value) and distinguish it from nice-to-have flows
- You make an **explicit v1 cut** — state what ships first and what is explicitly deferred, with reasoning tied to user value or risk reduction
- You identify **the seam** — the handoff point where your product connects to another system, third party, or stakeholder

---

## Common traps to avoid

**Trap 1: Jumping to screens before framing the problem**
Interviewers watch the clock. If you start talking about UI before you've said who the user is or what the problem is, you signal IC designer, not director.

**Trap 2: Designing for every user simultaneously**
Pick a primary user. State who you're optimising for. Strong candidates say "I'm designing for the field rep, not the surgeon — here's why."

**Trap 3: Listing features instead of making decisions**
Weak: "I would add a search bar, a filter panel, a notification system, and a recommendations section."
Strong: "The highest-leverage surface is X because Y. I'm deferring Z because the cost is high and the user need is secondary."

**Trap 4: No explicit metric**
Every design decision should be tied to something you can measure. Even if you say "this is directional," name what signal you're watching.

**Trap 5: Ignoring the unhappy path**
Designers talk about the happy path. Directors talk about failure states, error recovery, and edge users. End on a risk you'd watch closely.

---

## The v1 cut — how to make it defensible

A strong v1 cut has three parts:
1. **What ships** — the minimum set of flows that deliver the core value proposition
2. **What's deferred** — explicitly named, not just absent
3. **The criterion** — why this and not that? Usually: de-risks the riskiest assumption, unblocks the most users, or is technically necessary for everything else

Example:
> "V1 ships the diagnosis-to-parts-commit flow only. I'm deferring returns and new-part requests to v2. Reason: the commit latency problem is the one that's eroding technician trust and causing re-dispatches. If we solve that, we can earn the right to build the rest of the lifecycle."

---

## Connecting to Chandan's experience

These are your natural bridging points for any product design question:

| Design challenge | Your proof point |
|---|---|
| Designing for low-literacy or non-expert users | BYJU's K-8 learners; earn/spend comprehension research |
| Designing AI-assisted flows | HP field service AI — explainability, override, trust |
| Designing under connectivity constraints | HP field service — offline-first, partial states |
| Designing for regulated / high-stakes contexts | Stryker — auditability, serial tracking, compliance |
| 0→1 product design | WhiteHat Jr "Create with Math" — discovery to GTM |
| Design system thinking | BYJU's — 30+ components, 3 squads, adoption metrics |

Use one of these in the coaching notes whenever the question maps to your real work. Specificity beats generality every time.

---

## Senior signal phrases

These are things strong senior candidates say that juniors don't:

- "The question I'd want to answer first is..." (scoping)
- "I'm making an assumption here — [X] — and I'll call it out if it changes the design" (intellectual honesty)
- "This is the riskiest part of the design because..." (risk awareness)
- "I'd want to measure [X] because it's a leading indicator of [Y]" (metric thinking)
- "I'd defer [X] to v2 because [reason] — but I'd design the v1 architecture so it doesn't foreclose on it" (systems thinking)
- "A reasonable team might choose differently here — the counterargument is [X]" (senior confidence)
