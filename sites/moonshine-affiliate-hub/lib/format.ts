export function formatCurrency(n: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString()}`;
  }
}
