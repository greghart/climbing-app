export type Point = { x: number; y: number };
export type Points = Point[];

export function distanceTo(x1: number, y1: number, x2: number, y2: number) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

export function pointsToLine(...points: Points) {
  return points.map((p) => [p.x, p.y]).flat();
}
