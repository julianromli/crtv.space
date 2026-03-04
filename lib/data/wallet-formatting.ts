const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function formatUsdCents(value: number) {
  return currencyFormatter.format(value / 100);
}
