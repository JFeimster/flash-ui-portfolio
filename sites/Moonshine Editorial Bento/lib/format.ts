export function formatDate(isoDate: string) {
  // ISO yyyy-mm-dd
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
