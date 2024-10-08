import Trail from "@/db/entity/Trail";
import TrailLine from "@/db/entity/TrailLine";
import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  Area,
  Boulder,
  Comment,
  Commentable,
  Crag,
  Grade,
  GradingSystem,
  Polygon,
  PolygonCoordinate,
  Route,
} from "./entity";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [
    Area,
    Boulder,
    Comment,
    Commentable,
    Crag,
    Grade,
    GradingSystem,
    Polygon,
    PolygonCoordinate,
    Route,
    Trail,
    TrailLine,
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
