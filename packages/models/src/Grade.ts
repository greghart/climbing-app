import Route, { type IRoute } from "./Route.js";
// import GradingSystem from "./GradingSystem.js";

export enum GradingSystemType {
  V = "V",
  YDS = "YDS",
  // Font = "Font",
}

/**
 * Grades represent the selected difficulty of a boulder problem or route.
 * Note that the available grades are dependent on the grading system
 * @example
 *  {
 *    id: 1,
 *    raw: "V3/V4",
 *    system: GradingSystemType.BOULDER,
 *    value: 3.5,
 */
export interface IGrade {
  id?: number;
  system: GradingSystemType;
  raw: string;
  // Normalized value that can help sort all grades across all systems
  value: number;
  routes?: IRoute[];
}

interface Grade extends IGrade {}
class Grade {
  routes?: Route[];

  static build(raw: string) {
    return new Grade(parseRaw(raw));
  }

  constructor(data: IGrade) {
    this.id = data.id;
    this.system = data.system;
    this.raw = data.raw;
    this.value = data.value;
    if (data.routes) {
      this.routes = data.routes.map((route) => new Route(route));
    }
  }
}

export default Grade;

/**
 * Grade parsers
 */
export function parseRaw(raw: string): IGrade {
  if (raw.length === 0) {
    throw new RangeError("Invalid grade ''");
  }
  if (raw[0] === "V") {
    return parseRawV(raw);
  }
  if (raw.slice(0, 2) == "5." || raw[0] == ".") {
    return parseRawYDS(raw);
  }
  throw new RangeError(`No grading system found for  '${raw}'`);
}

const SPLITTERS = ["/", "-"];

function splitter(
  system: GradingSystemType,
  scorer: (raw: string, flexible?: boolean) => number
): (raw: string) => IGrade {
  return (raw: string) => {
    // Support split grades
    const trySplitter = (splitter: string) => {
      const components = raw.split(splitter);
      if (components.length > 2) {
        throw new RangeError(`Invalid ${system} grade '${raw}'`);
      }
      const score1 = scorer(components[0]);
      let score2 = scorer(components[0]);
      if (components.length === 2) {
        try {
          score2 = scorer(components[1]);
        } catch {
          // Allow second component to be "flexible"
          // Eg. V5/6, 5.10/11
          try {
            score2 = scorer(components[1], true);
          } catch {
            // Allow second component to replace first one
            // Eg. 5.11a/b -> 5.11b
            const grade = `${components[0].slice(
              0,
              -1 * components[1].length
            )}${components[1]}`;
            score2 = scorer(grade);
          }
        }
      }
      return [score1, score2];
    };
    for (var i = 0; i < SPLITTERS.length; i++) {
      try {
        const [score1, score2] = trySplitter(SPLITTERS[i]);
        return {
          system,
          raw,
          value: (score1 + score2) / 2,
        };
      } catch (e) {
        if (i === SPLITTERS.length - 1) {
          // last chance
          // always throw full input
          if (e instanceof RangeError) {
            throw new RangeError(`Invalid ${system} grade '${raw}'`);
          }
          throw e;
        }
      }
    }
    throw new Error("Unexpectedly failed to parse grade");
  };
}

export function parseRawVScore(raw: string, flexible: boolean = false): number {
  if (raw[0] !== "V") {
    if (flexible) {
      raw = `V${raw}`;
    } else {
      throw new RangeError(`Invalid V grade '${raw}'`);
    }
  }
  // Handle +/-
  let plus,
    minus = false;
  if (raw[raw.length - 1] == "-") {
    raw = raw.slice(0, -1);
    minus = true;
  } else if (raw[raw.length - 1] == "+") {
    raw = raw.slice(0, -1);
    plus = true;
  }
  // Should be a basic grade now
  let score = gradeValues[GradingSystemType.V]![raw];
  if (score === undefined) {
    throw new RangeError(`Invalid V grade '${raw}'`);
  }
  if (plus) {
    score += 1;
  }
  if (minus) {
    score -= 1;
  }
  return score;
}
export const parseRawV = splitter(GradingSystemType.V, parseRawVScore);

export function parseRawYDSScore(
  raw: string,
  flexible: boolean = false
): number {
  // also accept .x
  if (raw[0] === ".") {
    raw = `5${raw}`;
  }
  if (raw.slice(0, 2) !== "5.") {
    if (flexible) {
      raw = `5.${raw}`;
    } else {
      throw new RangeError(`Invalid YDS grade '${raw}'`);
    }
  }
  // Handle +/-
  let plus,
    minus = false;
  if (raw[raw.length - 1] == "-") {
    raw = raw.slice(0, -1);
    minus = true;
  } else if (raw[raw.length - 1] == "+") {
    raw = raw.slice(0, -1);
    plus = true;
  }
  // Should be a basic grade now
  let score = gradeValues[GradingSystemType.YDS]![raw];
  if (score === undefined) {
    throw new RangeError(`Invalid YDS grade '${raw}'`);
  }
  if (plus) {
    score += 1;
  }
  if (minus) {
    score -= 1;
  }
  return score;
}
export const parseRawYDS = splitter(GradingSystemType.YDS, parseRawYDSScore);


/** Grade data */
type TupleToRecord<T extends readonly string[], V> = {
  [K in T[number]]: V; // or any other type
};

// We are focusing on bouldering, so start with v scale and will adapt others
// into this value system. To start with, normalize as base (V+1) * 10
// Plus/minus grades can add/subtract 1
// Slash grades can average the two grades.
const VGrade = [
  "VB",
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12",
  "V13",
  "V14",
  "V15",
  "V16",
  "V17",
] as const;
const vGradeValues: TupleToRecord<typeof VGrade, number> = {
  VB: 0,
  V0: 10,
  V1: 20,
  V2: 30,
  V3: 40,
  V4: 50,
  V5: 60,
  V6: 70,
  V7: 80,
  V8: 90,
  V9: 100,
  V10: 110,
  V11: 120,
  V12: 130,
  V13: 140,
  V14: 150,
  V15: 160,
  V16: 170,
  V17: 180,
};

export const gradeValues: Record<GradingSystemType, Record<string, number>> = {
  [GradingSystemType.V]: vGradeValues,
  // Sourced from https://en.wikipedia.org/wiki/Grade_(climbing)#Comparison_bouldering
  [GradingSystemType.YDS]: {
    "5.1": -6,
    "5.2": -5,
    "5.3": -4,
    "5.4": -3,
    "5.5": -2,
    "5.6": -1,
    "5.7": vGradeValues.VB,
    "5.8": vGradeValues.V0 - 1,
    "5.9": vGradeValues.V0,
    "5.10": vGradeValues.V0 + 1,
    "5.10a": vGradeValues.V0 + 1, // 5.10a == 5.10
    "5.10b": vGradeValues.V0 + 2,
    "5.10c": vGradeValues.V1,
    "5.10d": (vGradeValues.V1 + vGradeValues.V2) / 2, // V1-2
    "5.11": vGradeValues.V2,
    "5.11a": vGradeValues.V2, // 5.11a == 5.11
    "5.11b": vGradeValues.V2 + 1,
    "5.11c": vGradeValues.V3,
    "5.11d": vGradeValues.V3 + 1,
    "5.12": vGradeValues.V4,
    "5.12a": vGradeValues.V4, // 5.12a == 5.12
    "5.12b": vGradeValues.V5,
    "5.12c": vGradeValues.V6,
    "5.12d": vGradeValues.V7,
    "5.13": vGradeValues.V8,
    "5.13a": vGradeValues.V8, // 5.13a == 5.13
    "5.13b": vGradeValues.V8 + 1,
    "5.13c": vGradeValues.V9,
    "5.13d": vGradeValues.V10,
    "5.14": vGradeValues.V11,
    "5.14a": vGradeValues.V11, // 5.14a == 5.14
    "5.14b": vGradeValues.V12,
    "5.14c": vGradeValues.V13,
    "5.14d": vGradeValues.V14,
    "5.15": vGradeValues.V15,
    "5.15a": vGradeValues.V15, // 5.15a == 5.15
    "5.15b": vGradeValues.V16,
    "5.15c": vGradeValues.V17,
  },
};
export const grades: Record<GradingSystemType, Record<string, Grade>> = Object.keys(GradingSystemType).reduce(
  (bySystem, system) => ({
    ...bySystem,
    [system]: Object.keys(gradeValues[system as GradingSystemType]).reduce((agg, v) => {
      agg[v] = Grade.build(v);
      return agg;
    }, {} as Record<string, Grade>),
  }),
  {} as Record<GradingSystemType, Record<string, Grade>>,
);
