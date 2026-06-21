"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CaretLeft,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { availability, bookingServices } from "@/lib/data";

type Step = "calendar" | "form" | "success";

type DayCell = {
  iso: string;
  day: number;
  isWeekend: boolean;
  isToday: boolean;
  isAvailable: boolean;
  isBooked: boolean;
};

const TODAY_ISO = "2026-06-21"; // Demo "today" — aligns with mock availability.
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildMonth(year: number, month: number): (DayCell | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert JS Sunday-start (0) to Monday-start grid.
  const startOffset = (first.getDay() + 6) % 7;

  const cells: (DayCell | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(year, month, d);
    const dow = new Date(year, month, d).getDay();
    cells.push({
      iso,
      day: d,
      isWeekend: dow === 0 || dow === 6,
      isToday: iso === TODAY_ISO,
      isAvailable: Boolean(availability.slots[iso]?.length),
      isBooked: availability.booked.includes(iso),
    });
  }
  return cells;
}

export function BookingCalendar() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("calendar");

  // Calendar state
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5); // June (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(bookingServices[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const cells = useMemo(
    () => buildMonth(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const slots = selectedDate ? availability.slots[selectedDate] ?? [] : [];

  const transition = {
    duration: reduce ? 0.15 : 0.4,
    ease: "easeInOut" as const,
  };
  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const selectDay = (cell: DayCell) => {
    if (!cell.isAvailable || cell.isBooked) return;
    setSelectedDate(cell.iso);
    setSelectedTime(null);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; email?: string } = {};
    if (!name.trim()) nextErrors.name = "Please enter your name.";
    if (!email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep("success");
  };

  const reset = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setEmail("");
    setService(bookingServices[0]);
    setMessage("");
    setErrors({});
  };

  const prettyDate = (iso: string | null) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
  };

  return (
    <section id="booking" className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">
            Booking
          </p>
          <h2 className="font-display text-4xl font-light leading-tight text-ink sm:text-5xl md:text-6xl">
            Find your <span className="italic">rhythm.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-mid">
            Pick a date and time that works for you. Send your request and I&rsquo;ll
            be in touch to confirm the details.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
          {(["calendar", "form", "success"] as Step[]).map((s, i) => (
            <span
              key={s}
              className={cn(
                "flex items-center gap-3",
                step === s ? "text-gold" : "text-ink-soft",
              )}
            >
              <span className="border border-current px-2 py-1">{i + 1}</span>
              <span className="hidden sm:inline">
                {s === "calendar" ? "Date" : s === "form" ? "Details" : "Done"}
              </span>
              {i < 2 && <span className="text-divider">—</span>}
            </span>
          ))}
        </div>

        <div
          className="border border-divider bg-white"
          style={{ boxShadow: "0 20px 60px rgba(23, 20, 16, 0.06)" }}
        >
          <AnimatePresence mode="wait">
            {/* ---------------- STEP 1: CALENDAR ---------------- */}
            {step === "calendar" && (
              <motion.div
                key="calendar"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="grid grid-cols-1 md:grid-cols-2"
              >
                {/* Month grid */}
                <div className="border-b border-divider p-6 md:border-b-0 md:border-r md:p-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-light text-ink">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        aria-label="Previous month"
                        className="border border-divider p-2 text-ink-mid transition-colors hover:border-gold hover:text-gold"
                      >
                        <CaretLeft size={16} weight="light" />
                      </button>
                      <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        aria-label="Next month"
                        className="border border-divider p-2 text-ink-mid transition-colors hover:border-gold hover:text-gold"
                      >
                        <CaretRight size={16} weight="light" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {WEEKDAYS.map((d) => (
                      <span
                        key={d}
                        className="pb-2 text-[0.65rem] uppercase tracking-wider text-ink-soft"
                      >
                        {d}
                      </span>
                    ))}
                    {cells.map((cell, i) =>
                      cell === null ? (
                        <span key={`empty-${i}`} />
                      ) : (
                        <button
                          key={cell.iso}
                          type="button"
                          disabled={!cell.isAvailable || cell.isBooked}
                          onClick={() => selectDay(cell)}
                          aria-label={`${prettyDate(cell.iso)}${
                            cell.isBooked
                              ? " — fully booked"
                              : cell.isAvailable
                                ? " — available"
                                : " — unavailable"
                          }`}
                          aria-pressed={selectedDate === cell.iso}
                          className={cn(
                            "relative flex aspect-square items-center justify-center border text-sm transition-colors",
                            selectedDate === cell.iso
                              ? "border-gold bg-gold text-ink"
                              : cell.isBooked
                                ? "cursor-not-allowed border-divider bg-warm-white text-ink-soft line-through"
                                : cell.isAvailable
                                  ? "border-divider text-ink hover:border-gold hover:text-gold"
                                  : cn(
                                      "cursor-not-allowed border-transparent",
                                      cell.isWeekend
                                        ? "text-ink-soft/60"
                                        : "text-ink-soft",
                                    ),
                          )}
                        >
                          {cell.day}
                          {cell.isToday && (
                            <span
                              className="absolute bottom-1 h-1 w-1 bg-gold"
                              aria-hidden
                            />
                          )}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Legend — not relying on color alone */}
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.7rem] text-ink-soft">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 border border-divider" />
                      Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 bg-gold" />
                      Selected
                    </span>
                    <span className="flex items-center gap-2 line-through">
                      Booked
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-1 w-1 bg-gold" />
                      Today
                    </span>
                  </div>
                </div>

                {/* Day details + time slots */}
                <div className="flex flex-col p-6 md:p-10">
                  <h4 className="font-display text-xl font-light text-ink">
                    {selectedDate ? prettyDate(selectedDate) : "Select a date"}
                  </h4>
                  <p className="mt-2 text-sm text-ink-soft">
                    {selectedDate
                      ? "Choose a time that suits you."
                      : "Available days are highlighted. Pick one to see times."}
                  </p>

                  {selectedDate && (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          aria-pressed={selectedTime === slot}
                          className={cn(
                            "border py-3 text-sm transition-colors",
                            selectedTime === slot
                              ? "border-gold bg-gold text-ink"
                              : "border-divider text-ink hover:border-gold hover:text-gold",
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep("form")}
                    className="mt-auto bg-gold px-8 py-4 text-sm font-medium tracking-wide text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-divider disabled:text-ink-soft"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------------- STEP 2: FORM ---------------- */}
            {step === "form" && (
              <motion.form
                key="form"
                onSubmit={submitForm}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="p-6 md:p-10"
              >
                <div className="mb-8 border border-divider bg-warm-white px-5 py-4 text-sm text-ink-mid">
                  <span className="text-ink">{prettyDate(selectedDate)}</span>
                  {" · "}
                  <span className="text-gold">{selectedTime}</span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Name" error={errors.name} htmlFor="bk-name">
                    <input
                      id="bk-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border border-divider bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                    />
                  </Field>

                  <Field label="Email" error={errors.email} htmlFor="bk-email">
                    <input
                      id="bk-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-divider bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                    />
                  </Field>

                  <Field label="Service" htmlFor="bk-service" className="md:col-span-2">
                    <select
                      id="bk-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full border border-divider bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                    >
                      {bookingServices.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Message (optional)"
                    htmlFor="bk-message"
                    className="md:col-span-2"
                  >
                    <textarea
                      id="bk-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full resize-none border border-divider bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                    />
                  </Field>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("calendar")}
                    className="flex items-center justify-center gap-2 border border-divider px-8 py-4 text-sm font-medium tracking-wide text-ink transition-colors hover:border-gold hover:text-gold"
                  >
                    <ArrowLeft size={16} weight="light" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 bg-gold px-8 py-4 text-sm font-medium tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Confirm Booking
                    <ArrowRight size={16} weight="light" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* ---------------- STEP 3: SUCCESS ---------------- */}
            {step === "success" && (
              <motion.div
                key="success"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="flex flex-col items-center p-10 text-center md:p-16"
              >
                <CheckCircle size={64} weight="light" className="text-gold" />
                <h3 className="mt-6 font-display text-4xl font-light text-ink">
                  Your request is in.
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink-mid">
                  Thank you for reaching out. I&rsquo;ll get back to you soon so we
                  can find the best rhythm, time, and class for you.
                </p>

                <div className="mt-8 w-full max-w-sm border border-divider bg-warm-white p-6 text-left text-sm">
                  <SummaryRow label="Service" value={service} />
                  <SummaryRow label="Date" value={prettyDate(selectedDate)} />
                  <SummaryRow label="Time" value={selectedTime ?? ""} />
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 bg-gold px-8 py-4 text-sm font-medium tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Book Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs uppercase tracking-[0.2em] text-ink-soft"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-gold">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-divider py-2 last:border-0">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
