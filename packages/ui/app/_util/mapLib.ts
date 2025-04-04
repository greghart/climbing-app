import type { LatLngExpression, LatLngTuple } from "leaflet";

/**
 * Various functions for calculating map distances and angles
 */
type VectorLiteral = { x: number; y: number };
type VectorTuple = [number, number];
type Vector = VectorLiteral | VectorTuple;

function vectorIsTuple(vector: Vector): vector is VectorTuple {
  return !!(vector as VectorTuple).length;
}
function vectorIsLiteral(vector: Vector): vector is VectorLiteral {
  return !vectorIsTuple(vector);
}
function normalizeToTuple(vector: Vector): VectorTuple {
  if (vectorIsLiteral(vector)) {
    return [vector.x, vector.y];
  }
  return vector;
}

// DISTANCE FUNCTIONS
type XY = { x: number; y: number };
function sqr(x: number) {
  return x * x;
}
function dist2(v: XY, w: XY) {
  return sqr(v.x - w.x) + sqr(v.y - w.y);
}
function dist(v: XY, w: XY) {
  return Math.sqrt(dist2(v, w));
}
function distToSegmentSquared(p: XY, v: XY, w: XY) {
  const l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
function distToSegment(p: XY, v: XY, w: XY) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}
function closestPoint(a: XY, b: XY, p: XY) {
  const aToP = [p.x - a.x, p.y - a.y];
  const aToB = [b.x - a.x, b.y - a.y];
  const aToB2 = aToB[0] * aToB[0] + aToB[1] * aToB[1];

  const dot = aToP[0] * aToB[0] + aToP[1] * aToB[1];

  const t = Math.max(Math.min(dot / aToB2, 1), 0);

  return {
    x: a.x + aToB[0] * t,
    y: a.y + aToB[1] * t,
  };
}

function dotProductTuple(a: VectorTuple, b: VectorTuple) {
  return a[0] * b[0] + a[1] * b[1];
}
function dotProduct(a: Vector, b: Vector) {
  return dotProductTuple(normalizeToTuple(a), normalizeToTuple(b));
}

function magnitudeTuple(a: VectorTuple) {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
function magnitude(a: Vector) {
  return magnitudeTuple(normalizeToTuple(a));
}

function radsToDegrees(x: number) {
  return (x * 180) / Math.PI;
}
function degreesToRads(x: number) {
  return (x * Math.PI) / 180;
}

// Radius of earth in KM
const R = 6378.137;

function measure(lat1: number, lon1: number, lat2: number, lon2: number) {
  // generally used geo measurement function
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // meters
}

// ANGLE FUNCTIONS
function getAngle(a: Vector, b: Vector) {
  return radsToDegrees(
    Math.acos(dotProduct(a, b) / (magnitude(a) * magnitude(b)))
  );
}
function latLngToMeters(v: number) {
  return v / 111111;
}
function rotateTuple(a: VectorTuple, radians: number): [number, number] {
  return [
    Math.cos(radians) * a[0] - Math.sin(radians) * a[1],
    Math.sin(radians) * a[0] + Math.cos(radians) * a[1],
  ];
}
function rotate(a: VectorLiteral, radians: number): VectorLiteral;
function rotate(a: VectorTuple, radians: number): VectorTuple;
function rotate(a: Vector, radians: number): Vector {
  if (vectorIsTuple(a)) {
    return rotateTuple(a, radians);
  }
  const newTuple = rotateTuple([a.x, a.y], radians);
  return { x: newTuple[0], y: newTuple[1] };
}

function latLngIsTuple(a: LatLngExpression): a is LatLngTuple {
  return !!(a as LatLngTuple).length;
}
function normalizeLatLng(a: LatLngExpression): LatLngTuple {
  if (latLngIsTuple(a)) {
    return a;
  }
  return [a.lat, a.lng];
}

const mapLib = {
  closestPoint,
  degreesToRads,
  dist,
  dist2,
  distToSegment,
  distToSegmentSquared,
  getAngle,
  latLngToMeters,
  magnitude,
  measure,
  normalizeLatLng,
  radsToDegrees,
  rotate,
  sqr,
};
export default mapLib;
export type { Vector, VectorLiteral, VectorTuple };
