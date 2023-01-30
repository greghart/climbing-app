import { DataSource } from "typeorm";
import * as pg from "pg";
import config from "config";

// Abstraction leak
// Make sure underlying db driver parses our decimals as a float
// Obviously this isn't entirely safe
pg.types.setTypeParser(1700, (v: any) => parseFloat(v));

const myDataSource = new DataSource({
  type: "better-sqlite3",
  database: config.get<string>("database.sqlite.database"),
  // type: 'postgres',
  // host: config.get<string>('database.postgres.host'),
  // port: config.get<number>('database.postgres.port'),
  // username: config.get<string>('database.postgres.username'),
  // password: config.get<string>('database.postgres.password'),
  // database: config.get<string>('database.postgres.database'),
  entities: [`${__dirname}/../models/*`],
  dropSchema: config.get<boolean>("database.sync"),
  synchronize: config.get<boolean>("database.sync"),
  logging: true,
});

export default myDataSource;
