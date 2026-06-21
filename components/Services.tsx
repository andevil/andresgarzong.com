import { BlurFade } from "@/components/magicui/BlurFade";
import { services } from "@/lib/data";

export function Services() {
  return (
    <section id="services" className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <BlurFade inViewMargin="-60px">
          <div className="max-w-2xl">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">
              Services
            </p>
            <h2 className="font-display text-4xl font-light leading-tight text-ink sm:text-5xl md:text-6xl">
              Ways to move <span className="italic">together.</span>
            </h2>
          </div>
        </BlurFade>

        <div className="mt-16 border-t border-divider">
          {services.map((service, i) => (
            <BlurFade key={service.index} delay={i * 0.05} inViewMargin="-40px">
              <a
                href="#booking"
                className="group grid grid-cols-1 items-baseline gap-3 border-b border-divider py-8 transition-colors md:grid-cols-12 md:gap-6 md:py-10"
              >
                <span className="font-display text-2xl font-light text-gold md:col-span-1">
                  {service.index}
                </span>
                <h3 className="font-display text-3xl font-light text-ink transition-colors duration-300 group-hover:text-gold md:col-span-4 md:text-4xl">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-mid md:col-span-5">
                  {service.description}
                </p>
                <span className="text-sm font-medium tracking-wide text-ink-mid transition-colors duration-300 group-hover:text-gold md:col-span-2 md:text-right">
                  {service.price}
                </span>
              </a>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
