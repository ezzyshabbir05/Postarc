/**
 * Deterministic date formatting functions for Next.js SSR / Client hydration consistency.
 * Explicitly pins locale to "en-US" and timeZone to "UTC" to eliminate server/client locale mismatch.
 */

export function formatDate(dateInput: string | number | Date): string {
  const d = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(d.getTime())) return String(dateInput)
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(dateInput: string | number | Date): string {
  const d = typeof dateInput === "object" ? dateInput : new Date(dateInput)
  if (isNaN(d.getTime())) return String(dateInput)
  const datePart = d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const timePart = d.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  return `${datePart}, ${timePart}`
}

