"use client";

import { useState } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { NumberTicker } from "@/components/magicui/NumberTicker";
import { stats } from "@/lib/data";

export function About() {
  // The portrait lives at /public/images/cristhian-portrait.jpg.
  // If it is missing, we fall back to a clean editorial placeholder block.
  // Drop the real photo at that path to replace the placeholder.
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Image column */}
          <BlurFade direction="left" inViewMargin="-80px">
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-warm-white">
                {!imgFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/images/cristhian-portrait.jpg"
                    alt="Cristhian Garzón, Colombian salsa instructor in Budapest"
                    className="h-full w-full object-cover"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center border border-divider bg-warm-white text-center">
                    <span className="font-display text-7xl font-light text-gold">
                      CG
                    </span>
                    <span className="mt-4 text-xs uppercase tracking-[0.25em] text-ink-soft">
                      Portrait placeholder
                    </span>
                    <span className="mt-2 max-w-[16rem] px-6 text-xs text-ink-soft">
                      Add /public/images/cristhian-portrait.jpg
                    </span>
                  </div>
                )}
              </div>

              {/* Floating card */}
              <div
                className="absolute -bottom-8 -right-4 hidden border border-divider bg-cream p-6 sm:block"
                style={{ boxShadow: "0 20px 60px rgba(23, 20, 16, 0.06)" }}
              >
                <ul className="space-y-2 text-sm text-ink-mid">
                  <li>Colombian energy</li>
                  <li>Budapest based</li>
                  <li>Social dance focused</li>
                </ul>
              </div>
            </div>
          </BlurFade>

          {/* Story column */}
          <BlurFade direction="right" inViewMargin="-80px" className="flex flex-col justify-center">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">
              About
            </p>
            <h2 className="font-display text-4xl font-light leading-tight text-ink sm:text-5xl md:text-6xl">
              Dance first.
              <br />
              <span className="italic">Technique with feeling.</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-mid">
              <p>
                Cristhian is a Colombian salsa instructor based in Budapest,
                teaching people how to feel confident on the dance floor. His
                classes blend technique, culture, rhythm, connection, and joy.
              </p>
              <p>
                From Cuban and LA style partnerwork to fast Colombian Salsa
                Caleña footwork, his teaching is rooted in social dancing,
                community, and the belief that dance can change your life —
                physically, mentally, emotionally, and spiritually.
              </p>
            </div>
          </BlurFade>
        </div>

        {/* Stats row */}
        <BlurFade delay={0.1} inViewMargin="-40px">
          <div className="mt-20 grid grid-cols-2 gap-px border border-divider bg-divider md:mt-28 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center bg-white px-4 py-10 text-center"
              >
                <span className="font-display text-5xl font-light text-gold md:text-6xl">
                  <NumberTicker value={stat.value} />
                  {stat.suffix}
                </span>
                <span className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
