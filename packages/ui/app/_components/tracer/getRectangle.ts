import { IBounds } from "models";

export default function getRectangle(bounds: IBounds) {
  const pointA = bounds.topLeft;
  const pointB = bounds.bottomRight;
  return [
    pointA,
    [pointA.lat, pointB.lng],
    pointB,
    [pointB.lat, pointA.lng],
    pointA,
  ] as [number, number][];
}
