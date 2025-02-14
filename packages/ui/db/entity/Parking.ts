import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { type IParking } from "models";
import { EntitySchema } from "typeorm";
import CoordinateSchema, { Coordinate } from "./Coordinate";
import { Crag } from "./Crag";

export type Parking = Omit<IParking, "crag" | "location"> & {
  crag?: Crag;
  cragId: number | null;
  location: Coordinate;
};

const ParkingSchema = new EntitySchema<Parking>({
  name: "parking",
  columns: {
    ...BaseColumnSchemaPart,
    name: {
      type: String,
      nullable: true,
    },
    description: {
      type: String,
      nullable: true,
    },
    cragId: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    crag: {
      type: "one-to-one",
      target: "crag",
      joinColumn: true,
      onDelete: "SET NULL",
      cascade: ["insert", "update"],
    },
  },
  embeddeds: {
    location: {
      schema: CoordinateSchema,
      prefix: "location_",
    },
  },
});

export default ParkingSchema;
