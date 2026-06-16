"use client"

import { useEffect, useRef, useState } from "react"

import {
  TerminalAnimationCommandBar,
  TerminalAnimationContent,
  TerminalAnimationOutput,
  TerminalAnimationRoot,
  TerminalAnimationTabList,
  TerminalAnimationWindow,
  useTerminalAnimation,
} from "@/components/ui/terminal-animation"
import {
  toolkitTerminalStartTab,
  toolkitTerminalTabs,
} from "@/lib/bento-toolkit-terminal-tabs"
import { cn } from "@/lib/utils"

function TabCycler({ tabCount }: { tabCount: number }) {
  const {
    activeTab,
    setActiveTab,
    isTypingCommand,
    visibleLines,
    currentTab,
    showCursor,
  } = useTerminalAnimation()

  useEffect(() => {
    const complete =
      !isTypingCommand &&
      visibleLines >= currentTab.lines.length &&
      !showCursor

    if (!complete) return

    const timer = window.setTimeout(() => {
      setActiveTab((activeTab + 1) % tabCount)
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [
    activeTab,
    currentTab.lines.length,
    isTypingCommand,
    setActiveTab,
    showCursor,
    tabCount,
    visibleLines,
  ])

  return null
}

function ToolkitTerminalStatic() {
  const tab = toolkitTerminalTabs[toolkitTerminalStartTab]

  return (
    <div className="bento-terminal bento-terminal--static dark pointer-events-none font-mono text-[11px] leading-relaxed text-neutral-300">
      <div className="bento-terminal__window rounded-t-lg bg-neutral-950">
        <div className="bento-terminal__content px-4 py-3">
          <div className="text-neutral-200">
            <span className="text-neutral-500">$</span> {tab.command}
          </div>
          <div className="mt-2 space-y-0.5">
            {tab.lines.map((line, index) => (
              <div key={index} className={line.color ?? "text-neutral-400"}>
                {line.text || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 border-t border-white/10 px-4 py-2">
          {toolkitTerminalTabs.map((item, index) => (
            <span
              key={item.label}
              className={cn(
                "rounded px-2 py-0.5 text-[10px] uppercase tracking-wide",
                index === toolkitTerminalStartTab
                  ? "bg-white/10 text-neutral-200"
                  : "text-neutral-600"
              )}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BentoToolkitTerminalBg({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(toolkitTerminalStartTab)
  const [playKey, setPlayKey] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || reduced) return

    let wasVisible = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting)
        if (visible && !wasVisible) {
          setActiveTab(toolkitTerminalStartTab)
          setPlayKey((key) => key + 1)
        }
        wasVisible = visible
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  if (reduced) {
    return (
      <div
        ref={rootRef}
        className={cn(
          "bento-bg-artifact bento-bg-artifact--terminal h-full w-full",
          className
        )}
        data-bento-bg-artifact="terminal"
      >
        <ToolkitTerminalStatic />
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "bento-bg-artifact bento-bg-artifact--terminal h-full w-full",
        className
      )}
      data-bento-bg-artifact="terminal"
    >
      <TerminalAnimationRoot
        key={playKey}
        tabs={toolkitTerminalTabs}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        alwaysDark
        hideCursorOnComplete
        className="pointer-events-none h-full w-full"
      >
        <TabCycler tabCount={toolkitTerminalTabs.length} />
        <TerminalAnimationWindow
          animateOnVisible={false}
          minHeight="12rem"
          backgroundColor="#0a0a0a"
          className="h-full rounded-t-lg shadow-none"
        >
          <TerminalAnimationContent className="px-4 py-3 sm:px-4 sm:py-3">
            <div className="flex font-mono text-[11px]">
              <span className="mr-1 text-neutral-500">$</span>
              <TerminalAnimationCommandBar className="text-neutral-200" />
            </div>
            <TerminalAnimationOutput
              className="mt-2 space-y-0.5 font-mono text-[11px] leading-relaxed"
              renderLine={(line, _index, visible) => {
                if (!visible) return null
                return (
                  <div className={line.color ?? "text-neutral-400"}>
                    {line.text || "\u00A0"}
                  </div>
                )
              }}
            />
          </TerminalAnimationContent>

          <TerminalAnimationTabList className="pointer-events-none flex gap-2 border-t border-white/10 px-4 py-2">
            {toolkitTerminalTabs.map((tab, index) => (
              <span
                key={tab.label}
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
                  index === activeTab
                    ? "bg-white/10 text-neutral-200"
                    : "text-neutral-600"
                )}
              >
                {tab.label}
              </span>
            ))}
          </TerminalAnimationTabList>
        </TerminalAnimationWindow>
      </TerminalAnimationRoot>
    </div>
  )
}
