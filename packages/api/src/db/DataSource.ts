import "reflect-metadata";
import { DataSource } from "typeorm";
import { Crag } from "../entity";

const MyDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Crag],
  migrations: [],
  subscribers: [],
});

export default MyDataSource;
