export function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) {
    return "00,00";
  }

  const integerPart = digits.slice(0, -2) || "0";
  const decimalPart = digits.slice(-2).padStart(2, "0");
  const normalizedInteger = integerPart
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${normalizedInteger || "0"},${decimalPart}`;
}
