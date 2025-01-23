// Point is a core building block of all our lines and polygons
interface IPoint {
  x: number;
  y: number;
}

interface Point extends IPoint {}
class Point {
  static distanceTo(a: Point, b: Point) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Point) {
    const a = this.x - other.x;
    const b = this.y - other.y;
    return Math.sqrt(a * a + b * b);
  }
}

// Line is a line segment between two points, additionally with some "tension"
// as konva calls it.
interface ILine {
  points: IPoint[];
}

interface Line extends Omit<ILine, "points"> {
  points: Point[];
}
class Line {
  constructor(points: Point[]) {
    this.points = points;
  }
}

// Top level TopogonData that can describe any of the above robustly
interface ITopogonData {
  lines: ILine[];
}
interface TopogonData extends Omit<ITopogonData, "lines"> {
  lines: Line[];
}
class TopogonData {
  constructor({ lines = [] }: { lines?: Line[] } = {}) {
    this.lines = lines;
  }
}

export { Line, Point, TopogonData, type ILine, type IPoint, type ITopogonData };
