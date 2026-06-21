"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_SIZE = 48;
const DEFAULT_MAGNIFICATION = 72;
const DEFAULT_DISTANCE = 140;

interface DockProps {
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
}

// MagicUI Dock — Apple-style magnification on pointer proximity.
export function Dock({
  children,
  className,
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  const renderChildren = () =>
    React.Children.map(children, (child) => {
      if (React.isValidElement<DockIconProps>(child)) {
        return React.cloneElement(child, {
          mouseX,
          size: iconSize,
          magnification: iconMagnification,
          distance: iconDistance,
        });
      }
      return child;
    });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-[80px] items-end gap-4 border border-divider bg-white px-4 pb-3",
        className,
      )}
    >
      {renderChildren()}
    </motion.div>
  );
}

interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}

export function DockIcon({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const fallback = useMotionValue(Infinity);
  const x = mouseX ?? fallback;

  const distanceCalc = useTransform(x, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: shouldReduceMotion ? size : scaleSize, height: size }}
      className={cn("flex aspect-square items-center justify-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
