import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StyleStrip } from "@/components/StyleStrip";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="portfolio-root">
      <Navbar />
      <main>
        <Hero />
        <StyleStrip />
        <About />
        <Services />
        <Testimonials />
        <BookingCalendar />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
