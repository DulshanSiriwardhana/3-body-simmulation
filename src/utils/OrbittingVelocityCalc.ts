import { Decimal } from "./Decimal";

export const OrbittingVelocityCalc=(G: Decimal, mass: Decimal, distance: Decimal )=>{
    // v = sqrt(G * m / r)
    const velocity = G.multiply(mass).divide(distance).sqrt();
    
    return velocity;
}