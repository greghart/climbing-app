import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  Area,
  Boulder,
  Crag,
  Polygon,
  PolygonCoordinate,
  Route,
  Grade,
  GradingSystem,
} from "./entity";

// Gets a singleton initialized data source
let singleton: DataSource;
async function getDataSource(options = null) {
  if (options && singleton) {
    throw new Error(
      "Data source is already initialized, can't use other options"
    );
  }
  if (singleton) return Promise.resolve(singleton);
  const ds = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    // logging: true,
    entities: [
      Crag,
      Area,
      Boulder,
      Polygon,
      PolygonCoordinate,
      Route,
      Grade,
      GradingSystem,
    ],
    migrations: [],
    subscribers: [],
    ...(options || {}),
  });
  await ds.initialize();
  singleton = ds;
  // await import("./seed");
  return ds;
}

export default getDataSource;
