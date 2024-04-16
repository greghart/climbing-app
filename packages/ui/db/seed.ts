import "reflect-metadata";
import { Crag } from "models";
import { Crag as CragEntity } from "./entity";
import getDataSource from "./getDataSource";
import tramJson from "./fixtures/TramData.json";
import santeeJson from "./fixtures/Santee.json";
import { Tram } from "@mui/icons-material";

getDataSource()
  .then(async (ds) => {
    console.log("Inserting a new crag into the database...");
    const repo = ds.getRepository(CragEntity);

    let tram = new Crag(tramJson as any); // any to let arrays pass as tuples
    await repo.clear();
    await repo.save(santeeJson);
    await repo.save({
      ...tram,
      areas: tram.areas.map((area) => ({
        ...area,
        polygon:
          area.polygon === undefined
            ? undefined
            : {
                ...area.polygon,
                coordinates: area.polygon.coordinates.map((coord, i) => ({
                  ...coord,
                  order: i,
                })),
              },
      })),
    });
    console.log("Loading crags from the database...");
    const tramData = await repo.findOne({
      where: {
        name: "TramWay",
      },
      relations: ["areas", "areas.polygon", "areas.polygon.coordinates"],
    });
    console.warn("Tram:\n", JSON.stringify(tramData, null, 2));
    if (tramData == null) {
      return;
    }
    console.log(tramData.areas?.[0]?.polygon?.coordinates);

    tram = new Crag(tramData);

    if (tram.center) {
      console.log("Center: ", tram.center.tuple);
    }
    console.log("Area 1:\n", tram.areas[0].polygon);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
