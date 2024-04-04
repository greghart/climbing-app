import * as fs from "fs";
import * as path from "path";
import Bluebird from "bluebird";
import { parse } from "csv/sync";
import { find } from "lodash-es";
import slugify from "slugify";

import getConnection from "../db/index.js";
import Route from "../models/Route.js";
import _debug from "../debug.js";
const debug = _debug.extend(
  "/home/greg/Checkouts/climbing-app/tools/import_grades"
);

const standardize = (str: string) =>
  (slugify as any)(str, { lower: true, remove: /[*+~.()'"!:@]/g });

const loadMountainProjectCSV = async () => {
  const dataRaw = await Bluebird.promisify(fs.readFile)(
    path.join(__dirname, "../static/data/mp-tram-routes.csv")
  );
  const data = parse(dataRaw.toString(), {
    columns: true,
  });
  getConnection()
    .then(async (connection) => {
      const routeRepository = connection.getRepository(Route);
      const routes = await routeRepository
        .createQueryBuilder("route")
        .innerJoinAndSelect("route.boulder", "boulder")
        .innerJoinAndSelect("boulder.area", "area")
        .innerJoinAndSelect("area.crag", "crag")
        .where("crag.name = :name", { name: "TramWay" })
        .getMany();

      let counter = 0;
      // Update every route that we have
      return Bluebird.map(
        data,
        (thisDatum: any) => {
          const existingRoute = find(routes, (r) => {
            return (
              standardize(r.name) === standardize(thisDatum.Route) &&
              standardize(thisDatum.Location.split(">")[0].trim()) ===
                standardize(r.boulder.name)
            );
          });
          if (existingRoute) {
            counter += 1;
            return connection
              .createQueryBuilder()
              .update(Route)
              .set({ length: thisDatum.Length })
              .where("id = :id", { id: existingRoute.id })
              .execute();
          }
        },
        { concurrency: 10 }
      ).then(() => {
        debug(`Updated ${counter} routes`);
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      process.exit(0);
    });
};

loadMountainProjectCSV();
