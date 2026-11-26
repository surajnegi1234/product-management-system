
const CCY = "INR";
const LOC = "en-IN";
const fmt = new Intl.NumberFormat(LOC, { style: "currency", currency: CCY });

export function formatPrice(p: number): string {
  return fmt.format(p);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
