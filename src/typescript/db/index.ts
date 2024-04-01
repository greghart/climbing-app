import "reflect-metadata";
import config from "config";
import loadFixtures from "./loadFixtures";
import dataSource from "./myDataSource";

/**
 * Singleton initialized
 */
const memoizedDataSource = () => {
  return dataSource
    .initialize()
    .then(async (ds) => {
      if (config.get<boolean>("database.sync")) {
        await loadFixtures(ds);
      }
      return ds;
    })
    .catch((err) => {
      console.error("Error on TypeORM database setup");
      console.error(err.message);
      console.error(err.stack);
      process.exit(1);
      throw err;
    });
};

export default memoizedDataSource;
