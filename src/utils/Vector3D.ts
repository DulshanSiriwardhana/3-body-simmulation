import { Decimal } from './Decimal';

export interface Vector3D {
  x: Decimal;
  y: Decimal;
  z: Decimal;
}

export class Vector3DUtils {
  static create(x: number | string, y: number | string, z: number | string = 0): Vector3D {
    return {
      x: new Decimal(x),
      y: new Decimal(y),
      z: new Decimal(z)
    };
  }

  static add(v1: Vector3D, v2: Vector3D): Vector3D {
    return {
      x: v1.x.add(v2.x),
      y: v1.y.add(v2.y),
      z: v1.z.add(v2.z)
    };
  }

  static subtract(v1: Vector3D, v2: Vector3D): Vector3D {
    return {
      x: v1.x.subtract(v2.x),
      y: v1.y.subtract(v2.y),
      z: v1.z.subtract(v2.z)
    };
  }

  static multiply(v: Vector3D, scalar: Decimal): Vector3D {
    return {
      x: v.x.multiply(scalar),
      y: v.y.multiply(scalar),
      z: v.z.multiply(scalar)
    };
  }

  static magnitude(v: Vector3D): Decimal {
    return v.x.multiply(v.x)
      .add(v.y.multiply(v.y))
      .add(v.z.multiply(v.z))
      .sqrt();
  }

  static normalize(v: Vector3D): Vector3D {
    const mag = Vector3DUtils.magnitude(v);
    if (mag.toNumber() === 0) {
      return { x: new Decimal(0), y: new Decimal(0), z: new Decimal(0) };
    }
    return {
      x: v.x.divide(mag),
      y: v.y.divide(mag),
      z: v.z.divide(mag)
    };
  }

  static zero(): Vector3D {
    return {
      x: new Decimal(0),
      y: new Decimal(0),
      z: new Decimal(0)
    };
  }
}