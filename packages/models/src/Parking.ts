import Coordinate, { type ICoordinateLiteral } from "./Coordinate.js";
import Crag, { type ICrag } from "./Crag.js";

export interface IParking {
  id?: number;
  name?: string; // If any specific name
  description?: string; // Should be human readable info about the parking area or directions.
  location: ICoordinateLiteral;
  // Associations
  crag?: ICrag;
}

interface Parking extends Omit<IParking, "location"> {}
class Parking {
  location: Coordinate;
  crag?: Crag;

  static build(data: IParking) {
    if (data instanceof Parking) return data;
    return new Parking(data);
  }

  constructor(data: IParking) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.location = Coordinate.build(data.location);
    if (data.crag) {
      this.crag = new Crag(data.crag);
    }
  }
}

export default Parking;
