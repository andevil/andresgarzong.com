import { BlurFade } from "@/components/magicui/BlurFade";
import { featuredTestimonial, supportingTestimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <BlurFade inViewMargin="-60px">
          <p className="mb-12 text-center text-xs uppercase tracking-[0.3em] text-gold">
            From the Salsita Family
          </p>
        </BlurFade>

        {/* Featured pull quote */}
        <BlurFade inViewMargin="-40px">
          <figure className="relative mx-auto max-w-3xl text-center">
            <span
              className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[16rem] leading-none text-divider"
              aria-hidden
            >
              &ldquo;
            </span>
            <blockquote className="relative font-display text-3xl font-light leading-snug text-ink sm:text-4xl md:text-5xl">
              {featuredTestimonial.quote}
            </blockquote>
            <figcaption className="mt-10 flex items-center justify-center gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center bg-warm-white text-sm font-medium text-gold"
                aria-hidden
              >
                {initials(featuredTestimonial.name)}
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-ink">
                  {featuredTestimonial.name}
                </span>
                <span className="block text-xs uppercase tracking-[0.2em] text-ink-soft">
                  {featuredTestimonial.descriptor}
                </span>
              </span>
            </figcaption>
          </figure>
        </BlurFade>

        <div className="mx-auto mt-20 max-w-3xl border-t border-divider" />

        {/* Supporting quotes */}
        <div className="mt-16 grid grid-cols-1 gap-px border border-divider bg-divider md:grid-cols-2">
          {supportingTestimonials.map((t, i) => (
            <BlurFade key={t.name} delay={i * 0.08} inViewMargin="-40px" className="h-full">
              <figure className="flex h-full flex-col bg-white p-8 md:p-10">
                <blockquote className="flex-1 text-lg leading-relaxed text-ink-mid">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    className="flex h-10 w-10 items-center justify-center bg-warm-white text-xs font-medium text-gold"
                    aria-hidden
                  >
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      {t.name}
                    </span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-ink-soft">
                      {t.descriptor}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
