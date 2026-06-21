"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
  type Variants,
} from "motion/react";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
  direction?: "up" | "down" | "left" | "right";
}

// MagicUI BlurFade — subtle blur + slide reveal on scroll. Honors reduced motion.
export function BlurFade({
  children,
  className,
  variant,
  duration = 0.5,
  delay = 0,
  yOffset = 12,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
  direction = "up",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const shouldReduceMotion = useReducedMotion();

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "down" || direction === "right" ? -1 : 1;

  const defaultVariants: Variants = {
    hidden: {
      [axis]: yOffset * sign,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  const reducedVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const combinedVariants = shouldReduceMotion
    ? reducedVariants
    : variant ?? defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: shouldReduceMotion ? 0 : 0.04 + delay,
          duration: shouldReduceMotion ? 0.2 : duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
