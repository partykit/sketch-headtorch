export type Point3D = {
  x: number;
  y: number;
  z: number;
};

export function crossProduct(v1: Point3D, v2: Point3D): Point3D {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

export function vectorBetweenPoints(a: Point3D, b: Point3D): Point3D {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
}

export function dotProduct(v1: Point3D, v2: Point3D): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function magnitude(v: Point3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function angleBetweenVectors(v1: Point3D, v2: Point3D): number {
  const dot = dotProduct(v1, v2);
  const magV1 = magnitude(v1);
  const magV2 = magnitude(v2);
  return Math.acos(dot / (magV1 * magV2));
}

export function angleBetweenVectorsWithDirection(
  v1: Point3D,
  v2: Point3D,
  directionVector: Point3D
): number {
  const angle = angleBetweenVectors(v1, v2);
  // Determine the sign based on the direction vector
  const sign = Math.sign(directionVector.x * v1.y - directionVector.y * v1.x);
  return sign * angle;
}

export function scaleToRange(
  input: number,
  lower: number,
  upper: number
): number {
  // Clamp the input if it's outside the bounds
  if (input <= lower) return 0;
  if (input >= upper) return 1;

  // Scale linearly between the bounds
  return (input - lower) / (upper - lower);
}
