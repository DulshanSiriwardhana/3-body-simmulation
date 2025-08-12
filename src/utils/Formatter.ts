import { Decimal } from "./Decimal";

export function formatDecimal(num: Decimal): string {
  const units = [
    { value: "1000000000000000000", symbol: "H" },
    { value: "1000000000000",       symbol: "T" },
    { value: "1000000000",          symbol: "B" },
    { value: "1000000",             symbol: "M" },
    { value: "1000",                symbol: "K" }
  ];

  const plain = BigInt(num.toNumber().toLocaleString('fullwide', { useGrouping: false }));

  for (const unit of units) {
    const unitValue = BigInt(unit.value);
    if (plain >= unitValue || plain <= -unitValue) {
      const divided = num.divide(new Decimal(unit.value));
      return divided.toNumber().toFixed(2).replace(/\.00$/, "") + unit.symbol;
    }
  }

  return num.toString();
}
