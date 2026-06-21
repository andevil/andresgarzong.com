"use client";

import {
  EnvelopeSimple,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";
import { Dock, DockIcon } from "@/components/magicui/Dock";
import { BlurFade } from "@/components/magicui/BlurFade";
import { socialLinks, type SocialLink } from "@/lib/data";

const ICONS: Record<SocialLink["icon"], Icon> = {
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  tiktok: TiktokLogo,
  email: EnvelopeSimple,
};

export function Contact() {
  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
          {/* Left */}
          <BlurFade direction="left" inViewMargin="-60px">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">
              Contact
            </p>
            <h2 className="font-display text-5xl font-light leading-[1.05] text-ink sm:text-6xl md:text-7xl">
              Let us work
              <br />
              <span className="italic">together.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink-mid">
              Whether you want to join a class, prepare a wedding dance, book a
              workshop, or bring Colombian salsa energy to your event, send a
              message and let&rsquo;s make it move.
            </p>
          </BlurFade>

          {/* Right */}
          <BlurFade direction="right" inViewMargin="-60px" className="flex flex-col justify-center">
            <Dock className="w-fit">
              {socialLinks.map((link) => {
                const IconCmp = ICONS[link.icon];
                return (
                  <DockIcon key={link.label}>
                    <a
                      href={link.href}
                      target={link.icon === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-full w-full items-center justify-center text-ink transition-colors hover:text-gold"
                    >
                      <IconCmp size={26} weight="light" />
                    </a>
                  </DockIcon>
                );
              })}
            </Dock>

            {/* Handle list */}
            <ul className="mt-10 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label} className="flex items-baseline gap-4">
                  <span className="w-24 text-xs uppercase tracking-[0.2em] text-ink-soft">
                    {link.label}
                  </span>
                  <a
                    href={link.href}
                    target={link.icon === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-sm text-ink transition-colors hover:text-gold"
                  >
                    {link.handle}
                  </a>
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
