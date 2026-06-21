"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
}

// MagicUI NumberTicker — animated count-up driven by a spring. Honors reduced motion.
export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(direction === "down" ? value : startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      motionValue.set(value);
      return;
    }
    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? startValue : value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction, startValue, shouldReduceMotion]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });
    return () => unsubscribe();
  }, [springValue, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
    >
      {startValue}
    </span>
  );
}
