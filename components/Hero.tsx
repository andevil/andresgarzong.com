"use client";

import MuxVideo from "@mux/mux-video-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const HERO_PLAYBACK_ID = "LgNB00c7gLG4emTMep78OyYXPwcqcfcwqeth02oj8G5X8";

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.18, delayChildren: 0.2 },
    },
  };

  const item: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 60, damping: 18 },
        },
      };

  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <MuxVideo
        playbackId={HERO_PLAYBACK_ID}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ ["--controls" as string]: "none" }}
      />

      {/* Dark scrim */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.38)" }}
        aria-hidden
      />

      {/* White gradient fade into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
        aria-hidden
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
      >
        <motion.p
          variants={item}
          className="mb-6 text-xs uppercase tracking-[0.35em] text-white/80 sm:text-sm"
        >
          Colombian Salsa · Partnerwork · Budapest
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display font-light leading-[0.92]"
          style={{ fontSize: "clamp(4rem, 13vw, 10rem)" }}
        >
          <span className="block">Cristhian</span>
          <span className="block italic">Garzón</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Salsa with sabor, technique, and a little bit of magic. From Cali-style
          footwork to partnerwork for the social dance floor.
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <a
            href="#booking"
            className="inline-block bg-gold px-9 py-4 text-sm font-medium tracking-wide text-ink transition-transform duration-300 hover:-translate-y-1"
          >
            Book a Class
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
