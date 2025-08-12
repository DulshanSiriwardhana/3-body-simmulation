export class Decimal {
  private value: string;
  private static PRECISION = 15;

  constructor(val: string | number) {
    if (typeof val === 'number') {
      if (!isFinite(val)) val = 0;
      this.value = val.toString();
    } else {
      this.value = val || '0';
    }
    this.normalize();
  }

  private normalize() {
    let num = parseFloat(this.value);
    if (!isFinite(num)) num = 0;
    this.value = num.toString();
  }

  static fromString(str: string): Decimal {
    return new Decimal(str);
  }

  add(other: Decimal): Decimal {
    const result = parseFloat(this.value) + parseFloat(other.value);
    return new Decimal(result);
  }

  subtract(other: Decimal): Decimal {
    const result = parseFloat(this.value) - parseFloat(other.value);
    return new Decimal(result);
  }

  multiply(other: Decimal): Decimal {
    const result = parseFloat(this.value) * parseFloat(other.value);
    return new Decimal(result);
  }

  divide(other: Decimal): Decimal {
    const divisor = parseFloat(other.value);
    if (Math.abs(divisor) < 1e-100) return new Decimal(0);
    const result = parseFloat(this.value) / divisor;
    return new Decimal(result);
  }

  sqrt(): Decimal {
    const num = parseFloat(this.value);
    return new Decimal(Math.sqrt(Math.abs(num)));
  }

  pow(exp: number): Decimal {
    const base = parseFloat(this.value);
    return new Decimal(Math.pow(base, exp));
  }

  isLessThan(other: Decimal): boolean {
    return parseFloat(this.value) < parseFloat(other.value);
  }

  abs(): Decimal {
    return new Decimal(Math.abs(parseFloat(this.value)));
  }

  toString(): string {
    const num = parseFloat(this.value);
    if (Math.abs(num) > 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(6);
    }
    return num.toFixed(6).replace(/\.?0+$/, '');
  }

  toNumber(): number {
    return parseFloat(this.value);
  }
}