export function formatCurrency(value: number, unit: string): string {
  // Uses Indian numbering system for currency
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

  return `${formattedValue} ${unit}`;
}
