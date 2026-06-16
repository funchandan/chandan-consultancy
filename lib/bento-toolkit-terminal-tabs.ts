import type { TabContent } from "@/components/ui/terminal-animation"

/** Toolkit bento terminal — research / frame / ship / measure */
export const toolkitTerminalTabs: TabContent[] = [
  {
    label: "research",
    command: "wp research init stakeholder-map",
    lines: [
      { text: "", delay: 80 },
      {
        text: "  Scanning interviews… 12 transcripts indexed",
        color: "text-[#b39aff]",
        delay: 400,
      },
      { text: "", delay: 80 },
      { text: "  Jobs surfaced:", color: "text-neutral-400", delay: 200 },
      {
        text: "    validate bets before build",
        color: "text-neutral-500",
        delay: 80,
      },
      {
        text: "    de-risk AI pilots with HITL",
        color: "text-neutral-500",
        delay: 80,
      },
      {
        text: "  > scaffold ready — decision teardown",
        color: "text-[#32f3e9]",
        delay: 200,
      },
    ],
  },
  {
    label: "frame",
    command: "wp frame spec decision-teardown",
    lines: [
      { text: "", delay: 80 },
      {
        text: "  Loading bet memo template…",
        color: "text-[#b39aff]",
        delay: 300,
      },
      { text: "", delay: 80 },
      {
        text: "  kill date · reversal cost · owner",
        color: "text-neutral-400",
        delay: 200,
      },
      {
        text: "  seam map attached (3 systems)",
        color: "text-neutral-500",
        delay: 150,
      },
      {
        text: "  ✓ frame exported — ready to ship",
        color: "text-[#22ff73]",
        delay: 300,
      },
    ],
  },
  {
    label: "ship",
    command: "wp ship framework toolkits",
    lines: [
      { text: "", delay: 80 },
      {
        text: "  Bundling ship-ready frameworks…",
        color: "text-[#b39aff]",
        delay: 400,
      },
      { text: "", delay: 80 },
      {
        text: "  ✓ decision-teardown.html",
        color: "text-[#22ff73]",
        delay: 100,
      },
      {
        text: "  ✓ ai-workflow-ux.html",
        color: "text-[#22ff73]",
        delay: 80,
      },
      {
        text: "  ✓ architecture-audit.html",
        color: "text-[#22ff73]",
        delay: 80,
      },
      { text: "", delay: 80 },
      {
        text: "  3 artefacts published to /toolkits",
        color: "text-neutral-400",
        delay: 300,
      },
    ],
  },
  {
    label: "measure",
    command: "wp measure outcomes cohort-q2",
    lines: [
      { text: "", delay: 80 },
      {
        text: "  Tracking proof signals…",
        color: "text-[#b39aff]",
        delay: 300,
      },
      { text: "", delay: 80 },
      {
        text: "  decision latency  −41%",
        color: "text-[#32f3e9]",
        delay: 150,
      },
      {
        text: "  pilot override rate  within guardrails",
        color: "text-neutral-500",
        delay: 100,
      },
      {
        text: "  ✓ measure loop closed",
        color: "text-[#22ff73]",
        delay: 300,
      },
    ],
  },
]

/** Spec: animation restarts on viewport enter at tab `frame` */
export const toolkitTerminalStartTab = 1
