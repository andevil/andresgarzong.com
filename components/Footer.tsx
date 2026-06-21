import { navLinks } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-6 py-10 text-sm md:flex-row md:justify-between md:px-10">
        <span className="font-display text-2xl font-light text-gold">
          Cristhian Garzón
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink-mid transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span className="text-ink-soft">© {year} Salsita with Cris</span>
      </div>
    </footer>
  );
}
