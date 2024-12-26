import resolveCrag from "@/app/api/resolveCrag";
import {
  AreaSchema,
  BoulderSchema,
  CragSchema,
  getDataSource,
  RouteSchema,
} from "@/db";
import { Crag } from "models";

/**
 * Download crag data from OpenBeta.io
 */
const API_ENDPOINT = "https://stg-api.openbeta.io/";
const QUERY = `
  query MyQuery {
    areas(filter: {area_name: {match: "$name" }}) {
      areaName
      children {
        areaName
        metadata {
          lat
          lng
        }
        children {
          areaName
          metadata {
            lat
            lng
          }
          climbs {
            name
            grades {
              yds
              vscale
            }
            gradeContext
          }
        }
      }
    }
  }
`;

async function downloadCragData(cragId: number) {
  const ds = await getDataSource();
  const _crag = resolveCrag(
    await ds.getRepository(CragSchema).findOneBy({ id: cragId })
  );
  if (!_crag) {
    throw new Error(`crag ${cragId} not found`);
  }
  const crag = Crag.build(_crag);

  const body = JSON.stringify({
    operationName: "MyQuery",
    query: QUERY.replaceAll("$name", crag.name),
  });
  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch crag data: (${res.status}) ${res.statusText}`
    );
  }
  const data = (await res.json()).data.areas[0];
  console.warn(JSON.stringify(data, null, 2));
  await ds.transaction(async (tx) => {
    for (const _area of data.children) {
      // Find or create area
      let area = await tx
        .getRepository(AreaSchema)
        .findOneBy({ name: _area.areaName });
      if (!area) {
        console.warn("Creating area", _area.areaName);
        area = await tx
          .getRepository(AreaSchema)
          .create({ name: _area.areaName, crag: crag });
      }
      await tx.getRepository(AreaSchema).save(area);

      for (const _boulder of _area.children) {
        // Find or create boulder
        let boulder = await tx
          .getRepository(BoulderSchema)
          .findOneBy({ name: _boulder.areaName, area });
        if (!boulder) {
          console.warn("Creating boulder", _boulder.areaName);
          boulder = await tx
            .getRepository(BoulderSchema)
            .create({ name: _boulder.areaName, area });
        }
        boulder.coordinates = {
          lat: _boulder.metadata.lat,
          lng: _boulder.metadata.lng,
        };
        await tx.getRepository(BoulderSchema).save(boulder);
        for (const _route of _boulder.climbs) {
          // Find or create route
          let route = await tx
            .getRepository(RouteSchema)
            .findOneBy({ name: _route.name, boulder });
          if (!route) {
            console.warn("Creating route", _route.name);
            route = await tx
              .getRepository(RouteSchema)
              .create({ name: _route.name, boulder });
          }
          route.gradeRaw = _route.grades.yds || _route.grades.vscale;
          await tx.getRepository(RouteSchema).save(route);
        }
      }
    }
  });
}

// run
downloadCragData(55)
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    console.error("oh no");
    process.exit(1);
  });
