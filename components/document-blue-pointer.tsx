"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

const POINTER_PATH =
  "M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z";

/**
 * Document-scoped blue pointer — Magic UI colored variant (`fill-blue-500`).
 */
export function DocumentBluePointer() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const root = document.documentElement;
    root.classList.add("wp-blue-pointer-active");

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setActive(true);
    };

    const onLeave = () => {
      setActive(false);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      root.classList.remove("wp-blue-pointer-active");
      setActive(false);
    };
  }, [x, y]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
          style={{ top: y, left: x }}
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.82, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.33, 1, 0.32, 1] }}
          aria-hidden
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="1"
            viewBox="0 0 16 16"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("rotate-[-70deg] stroke-white fill-blue-500 text-blue-500")}
          >
            <path d={POINTER_PATH} />
          </svg>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
