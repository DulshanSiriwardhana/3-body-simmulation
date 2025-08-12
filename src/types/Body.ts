import { Vector3D } from '../utils/Vector3D';
import { Decimal } from '../utils/Decimal';

export interface Body {
  id: number;
  name: string;
  mass: Decimal;
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  color: string;
  radius: number;
  trail: Array<{ x: number; y: number; z: number }>;
}

export interface SimulationState {
  bodies: Body[];
  time: Decimal;
  totalSteps: number;
}

export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}