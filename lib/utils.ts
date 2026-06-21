// Lightweight clsx-style className combiner — keeps components dependency-free.
type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const process = (value: ClassValue): void => {
    if (!value) return;
    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      value.forEach(process);
    } else if (typeof value === "object") {
      for (const key in value) {
        if (value[key]) out.push(key);
      }
    }
  };

  inputs.forEach(process);
  return out.join(" ");
}
