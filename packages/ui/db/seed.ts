import "reflect-metadata";
import { Crag, Grade, GradingSystem, GradingSystemType, IGrade } from "models";
import * as entity from "./entity";
import getDataSource from "./getDataSource";
import tramJson from "./fixtures/TramData.json";
import santeeJson from "./fixtures/Santee.json";
import { Tram } from "@mui/icons-material";

getDataSource()
  .then(async (ds) => {
    console.log("Inserting a new crag into the database...");

    // Setup grading systems
    const systemRepo = ds.getRepository(entity.GradingSystem);
    const vGrading = {
      name: "Vermin (V) Scale",
      // type: GradingSystemType.BOULDER,
      type: "boulder",
      grades: ["B", ...Array.from({ length: 18 }, (v, i) => i)].map((g, i) => {
        return new Grade({
          name: `V${g}`,
          order: i,
        });
      }),
    };
    await systemRepo.clear();
    await systemRepo.save(vGrading);

    const gradeRepo = ds.getRepository(entity.Grade);
    const boulderGrades = await gradeRepo.find({
      where: { system: { name: "Vermin (V) Scale" } },
    });
    const gradesByName = boulderGrades.reduce((acc, grade) => {
      acc[grade.name] = grade;
      return acc;
    }, {} as Record<string, IGrade>);

    // Load crags
    const cragRepo = ds.getRepository(entity.Crag);
    let tram = new Crag(tramJson as any); // any to let arrays pass as tuples
    await cragRepo.clear();
    await cragRepo.save(santeeJson);
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
            grade:
              gradesByName[
                route.gradeRaw.replaceAll("-", "").replaceAll("+", "")
              ],
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
      ],
    });
    console.warn("Tram:\n", JSON.stringify(tramData, null, 2));
    if (tramData == null) {
      return;
    }
    console.log(tramData.areas?.[0]?.boulders?.[0]?.coordinates);

    const loadedTram = new Crag(tramData);

    if (loadedTram.center) {
      console.log("Center: ", loadedTram.center.tuple);
    }
    console.log("Area 1:\n", (loadedTram.areas || [])[0].polygon);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
