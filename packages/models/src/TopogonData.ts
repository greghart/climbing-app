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

  constructor(data: IPoint) {
    this.x = data.x;
    this.y = data.y;
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
  color?: string; // Color of line, defaults to green
  tension?: number; // Tension of line, defaults to 1
}

interface Line extends Omit<ILine, "points"> {
  points: Point[];
}
class Line {
  constructor(data: ILine) {
    this.points = data.points.map((p) => new Point(p));
    this.color = data.color;
    this.tension = data.tension;
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
  constructor(data: ITopogonData) {
    this.lines = data.lines.map((l) => new Line(l));
  }
}

export { Line, Point, type ILine, type IPoint, type ITopogonData };
export default TopogonData;
