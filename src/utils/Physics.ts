import { Body } from '../types/Body';
import { Vector3D, Vector3DUtils } from './Vector3D';
import { Decimal } from './Decimal';

export class PhysicsEngine {
  private G: Decimal;
  private minDistance: Decimal;

  constructor(gravitationalConstant: Decimal, minDistance: Decimal) {
    this.G = gravitationalConstant;
    this.minDistance = minDistance;
  }

  calculateDistance(pos1: Vector3D, pos2: Vector3D): Decimal {
    const dx = pos1.x.subtract(pos2.x);
    const dy = pos1.y.subtract(pos2.y);
    const dz = pos1.z.subtract(pos2.z);
    
    return dx.multiply(dx).add(dy.multiply(dy)).add(dz.multiply(dz)).sqrt();
  }

  calculateGravitationalForce(body1: Body, body2: Body): Vector3D {
    const distance = this.calculateDistance(body1.position, body2.position);
    
    if (distance.isLessThan(this.minDistance)) {
      return Vector3DUtils.zero();
    }
    
    // F = G * m1 * m2 / r^2
    const forceMagnitude = this.G.multiply(body1.mass).multiply(body2.mass).divide(distance.pow(2));
    
    // Direction vector (normalized)
    const dx = body2.position.x.subtract(body1.position.x);
    const dy = body2.position.y.subtract(body1.position.y);
    const dz = body2.position.z.subtract(body1.position.z);
    
    return {
      x: forceMagnitude.multiply(dx).divide(distance),
      y: forceMagnitude.multiply(dy).divide(distance),
      z: forceMagnitude.multiply(dz).divide(distance)
    };
  }

  updateBodies(bodies: Body[], timeStep: Decimal): Body[] {
    const newBodies = bodies.map(body => ({
      ...body,
      trail: [...body.trail],
      acceleration: Vector3DUtils.zero()
    }));

    // Calculate gravitational forces and accelerations
    for (let i = 0; i < newBodies.length; i++) {
      for (let j = i + 1; j < newBodies.length; j++) {
        const force = this.calculateGravitationalForce(newBodies[i], newBodies[j]);
        
        // Apply Newton's second law: a = F/m
        const a1 = Vector3DUtils.multiply({ x: force.x, y: force.y, z: force.z }, new Decimal(1).divide(newBodies[i].mass));
        const a2 = Vector3DUtils.multiply({ x: force.x, y: force.y, z: force.z }, new Decimal(-1).divide(newBodies[j].mass));
        
        newBodies[i].acceleration = Vector3DUtils.add(newBodies[i].acceleration, a1);
        newBodies[j].acceleration = Vector3DUtils.add(newBodies[j].acceleration, a2);
      }
    }

    // Update positions and velocities using Verlet integration
    newBodies.forEach(body => {
      const dtSquared = timeStep.multiply(timeStep);
      const halfDtSquared = dtSquared.multiply(new Decimal('0.5'));
      
      // Update position: x = x + v*dt + 0.5*a*dt²
      body.position.x = body.position.x
        .add(body.velocity.x.multiply(timeStep))
        .add(body.acceleration.x.multiply(halfDtSquared));
      body.position.y = body.position.y
        .add(body.velocity.y.multiply(timeStep))
        .add(body.acceleration.y.multiply(halfDtSquared));
      body.position.z = body.position.z
        .add(body.velocity.z.multiply(timeStep))
        .add(body.acceleration.z.multiply(halfDtSquared));
      
      // Update velocity: v = v + a*dt
      body.velocity.x = body.velocity.x.add(body.acceleration.x.multiply(timeStep));
      body.velocity.y = body.velocity.y.add(body.acceleration.y.multiply(timeStep));
      body.velocity.z = body.velocity.z.add(body.acceleration.z.multiply(timeStep));
    });

    return newBodies;
  }

  setMinDistance(minDistance: Decimal): void {
    this.minDistance = minDistance;
  }

  setGravitationalConstant(G: Decimal): void {
    this.G = G;
  }
}