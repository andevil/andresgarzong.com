import { Marquee } from "@/components/magicui/Marquee";
import { styleKeywords } from "@/lib/data";

export function StyleStrip() {
  return (
    <div className="border-y border-divider bg-warm-white">
      <Marquee pauseOnHover className="[--duration:45s] [--gap:0rem] py-3">
        {styleKeywords.map((word) => (
          <span
            key={word}
            className="flex items-center text-xs uppercase tracking-[0.25em] text-ink-mid"
          >
            {word}
            <span
              className="mx-6 inline-block h-1 w-1 bg-gold"
              aria-hidden
            />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
