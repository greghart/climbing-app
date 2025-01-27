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
  color: string; // Color of line
  tension: number; // Tension of line
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

// Label is some text displayed on a background
interface ILabel {
  text: string;
  point: IPoint;
  color: string; // Color of text
  fill: string; // Color of background fill
  direction: "up" | "right" | "down" | "left" | "none"; // Direction of label tag (if any)
}

interface Label extends Omit<ILabel, "point"> {
  point: Point;
}

class Label {
  constructor(data: ILabel) {
    this.text = data.text;
    this.direction = data.direction;
    this.point = new Point(data.point);
    this.color = data.color;
    this.fill = data.fill;
  }
}

// Top level TopogonData that can describe any of the above robustly
interface ITopogonData {
  lines: ILine[];
  labels: ILabel[];
}
interface TopogonData extends Omit<ITopogonData, "lines" | "labels"> {
  lines: Line[];
  labels: Label[];
}
class TopogonData {
  constructor(data: ITopogonData) {
    this.lines = data.lines.map((l) => new Line(l));
    this.labels = data.labels.map((l) => new Label(l));
  }
}

export {
  Label,
  Line,
  Point,
  TopogonData,
  type ILabel,
  type ILine,
  type IPoint,
  type ITopogonData,
};
export default TopogonData;
