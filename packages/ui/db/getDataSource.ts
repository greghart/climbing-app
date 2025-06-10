import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "./entity";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "../../database.sqlite",
  synchronize: true,
  logging: false,
  entities: [
    entities.AreaSchema,
    entities.BoulderSchema,
    entities.CommentSchema,
    entities.CommentableSchema,
    entities.CragSchema,
    entities.ParkingSchema,
    entities.PhotoSchema,
    entities.PhotoableSchema,
    entities.PolygonSchema,
    entities.PolygonCoordinateSchema,
    entities.RouteSchema,
    entities.TopoSchema,
    entities.TopogonSchema,
    entities.TrailSchema,
    entities.TrailLineSchema,
    entities.UploadSchema,
  ],
  migrations: [],
  subscribers: [],
});

let pending: Promise<DataSource>;
// our data source that's been initialized, needed to actually query anything
// just grab ds to setup custom repos
async function getDataSource() {
  if (pending) {
    return pending;
  }
  pending = dataSource.initialize();

  // await import("./seed");
  return pending;
}

export default getDataSource;
