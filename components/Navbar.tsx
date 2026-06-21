"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-divider bg-warm-white/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <a
          href="#home"
          className="font-display text-3xl font-light tracking-wide text-gold"
          aria-label="Salsita with Cris — home"
        >
          CG
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors duration-300 hover:text-gold",
                scrolled ? "text-ink" : "text-white",
              )}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#booking"
            className="bg-gold px-6 py-3 text-sm font-medium tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            Book a Class
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className={cn(
            "md:hidden",
            scrolled ? "text-ink" : "text-white",
          )}
        >
          <List size={28} weight="light" />
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col bg-white md:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="font-display text-3xl font-light text-gold">
                CG
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-ink"
              >
                <X size={28} weight="light" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-8 px-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.1 + i * 0.07,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="font-display text-5xl font-light text-ink transition-colors hover:text-gold"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-8 pb-12">
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="block bg-gold px-6 py-4 text-center text-sm font-medium tracking-wide text-ink"
              >
                Book a Class
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
