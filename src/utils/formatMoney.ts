export function formatMoney(amount: number | string): string {
  if (!amount) return "";
  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount.replace(/\./g, "")) : amount
  return numericAmount.toLocaleString("de-DE")
}

export function unformatMoney(formattedAmount: string): number {
  return Number.parseFloat(formattedAmount.replace(/\./g, ""))
}

