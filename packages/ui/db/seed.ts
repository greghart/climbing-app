import { Crag } from "models";
import "reflect-metadata";
import * as entity from "./entity";
import santeeJson from "./fixtures/Santee.json";
import tramJson from "./fixtures/TramData.json";
import getDataSource from "./getDataSource";

getDataSource()
  .then(async (ds) => {
    console.log("Inserting a new crag into the database...");

    // Load crags
    const cragRepo = ds.getRepository(entity.CragSchema);
    let tram = new Crag(tramJson as any); // any to let arrays pass as tuples
    await cragRepo.clear();
    await cragRepo.save(santeeJson);
    const pending = {
      ...tram,
      areas: (tram.areas || []).map((area) => ({
        ...area,
        polygon:
          area.polygon === undefined
            ? undefined
            : {
                ...area.polygon,
                coordinates: (area.polygon.coordinates || []).map(
                  (coord, i) => ({
                    ...coord,
                    order: i,
                  })
                ),
              },
        boulders: (area.boulders || []).map((boulder) => ({
          ...boulder,
          routes: (boulder.routes || []).map((route, i) => ({
            ...route,
            boulder: undefined,
          })),
        })),
      })),
    };
    await cragRepo.save({
      ...tram,
      areas: (tram.areas || []).map((area) => ({
        ...area,
        polygon:
          area.polygon === undefined
            ? undefined
            : {
                ...area.polygon,
                coordinates: (area.polygon.coordinates || []).map(
                  (coord, i) => ({
                    ...coord,
                    order: i,
                  })
                ),
              },
        boulders: (area.boulders || []).map((boulder) => ({
          ...boulder,
          routes: (boulder.routes || []).map((route, i) => ({
            ...route,
            boulder: undefined,
          })),
        })),
      })),
    });

    /** Double check data  */
    console.log("Loading crags from the database...");
    const tramData = await cragRepo.findOne({
      where: {
        name: "TramWay",
      },
      relations: [
        "areas",
        "areas.polygon",
        "areas.polygon.coordinates",
        "areas.boulders",
        "areas.boulders.routes",
      ],
    });
    if (tramData == null || (tramData.areas || []).length == 0) {
      throw new Error("TramWay crag did not seed correctly :(");
    }
  })
  .catch((error) => console.log(error));
