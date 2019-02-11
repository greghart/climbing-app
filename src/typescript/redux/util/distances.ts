function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function dist(v, w) { return Math.sqrt(dist2(v, w)); }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
function closestPoint(a, b, p) {
  const aToP = [p.x - a.x, p.y - a.y];
  const aToB = [b.x - a.x, b.y - a.y];
  const aToB2 = aToB[0] * aToB[0] + aToB[1] * aToB[1];

  const dot = aToP[0] * aToB[0] + aToP[1] * aToB[1];

  const t = dot / aToB2;

  return {
    x: a.x + aToB[0]*t,
    y: a.y + aToB[1]*t
  };
  // const aTob = [b.x - a.x, b.y - a.y];
  // const perpendicular = [ -aTob[1], aTob[0] ];
  // const q = {
  //   x: p.x + perpendicular[0],
  //   y: p.y + perpendicular[1]
  // };
  // return {
  //   x: ((a.x*b.y - a.y*b.x)*(p.x - q.x) - (a.x-b.x)*(p.x*q.y - p.y*q.x)) / ((a.x - b.x)*(p.y-q.y) - (a.y - b.y)*(p.y-q.y)),
  //   y: ((a.x*b.y - a.y*b.x)*(p.y - q.y) - (a.y-b.y)*(p.x*q.y - p.y*q.x)) / ((a.x - b.x)*(p.y-q.y) - (a.y - b.y)*(p.y-q.y))
  // };
}

export { sqr, dist, dist2, distToSegmentSquared, distToSegment, closestPoint }
