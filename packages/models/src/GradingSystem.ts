import Grade, { type IGrade } from "./Grade.js";

export enum GradingSystemType {
  BOULDER = "boulder",
  SPORT = "sport",
  ICE = "ICE",
}

export interface IGradingSystem {
  id?: number;
  name: string;
  type: string;
  grades?: IGrade[];
}

interface GradingSystem extends IGradingSystem {}
class GradingSystem {
  grades?: Grade[];

  constructor(data: IGradingSystem) {
    this.id = data.id;
    this.name = data.name;
    if (data.grades) {
      this.grades = data.grades.map((grade) => new Grade(grade));
    }
  }
}

export default GradingSystem;
