import "reflect-metadata";
import { Crag } from "models";
import { Crag as CragEntity } from "./entity";
import getDataSource from "./getDataSource";

getDataSource()
  .then(async (ds) => {
    console.log("Inserting a new crag into the database...");
    const repo = ds.getRepository(CragEntity);
    const getSantee = async () => {
      const crag = await repo.findOneBy({ name: "Santee" });
      if (crag) {
        return crag;
      }
      return new Crag({
        name: "Santee",
        center: {
          lat: 32.85052,
          lng: -117.02223,
        },
        defaultZoom: 18,
        minZoom: 15,
        maxZoom: 22,
      });
    };
    const crag = await getSantee();
    console.log("Loaded santee with id: " + crag.id);

    console.log("Loading crags from the database...");
    const crags = (await repo.find()).map((crag) => new Crag(crag));
    console.log("Loaded crags: ", crags);
    if (crags[0].center) {
      console.log("Center: ", crags[0].center.tuple);
    }

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
