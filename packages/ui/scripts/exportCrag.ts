import resolveCrag from "@/app/api/resolveCrag";
import {
  AreaSchema,
  BoulderSchema,
  CragSchema,
  getDataSource,
  PhotoableSchema,
  RouteSchema,
} from "@/db";
import { Boulder, Crag, Route } from "models";

export default async function exportCrag(id: number) {
  // Validate all grades in our database
  const ds = await getDataSource();
  const _crag = resolveCrag(
    await ds.getRepository(CragSchema).findOne({
      where: { id },
      relations: ["areas", "trail", "trail.lines", "photoable"],
    })
  );
  if (!_crag) {
    throw new Error(`crag ${id} not found`);
  }
  const crag = Crag.build(_crag);

  const photosAndTopos = [
    "photos",
    "photos.upload",
    "photos.topo",
    "photos.topo.topogons",
  ];
  const cragPhotoable = await ds.getRepository(PhotoableSchema).findOne({
    where: { id: crag.photoable?.id },
    relations: photosAndTopos,
  });

  const json = {
    ...crag,
    photos: cragPhotoable?.photos || [],
    areas: await Promise.all(
      crag.areas.map(async (_area) => {
        const area = await ds.getRepository(AreaSchema).findOne({
          where: { id: _area.id },
          relations: [
            "boulders",
            "polygon",
            "polygon.coordinates",
            "photoable",
          ],
        });
        const areaPhotoable = await ds.getRepository(PhotoableSchema).findOne({
          where: { id: area!.photoable?.id },
          relations: photosAndTopos,
        });
        const boulders = await Promise.all(
          (area!.boulders || []).map(async (_boulder) => {
            const boulder = await ds.getRepository(BoulderSchema).findOne({
              where: { id: _boulder.id },
              relations: [
                "routes",
                "polygon",
                "polygon.coordinates",
                "photoable",
              ],
            });
            const boulderPhotoable = await ds
              .getRepository(PhotoableSchema)
              .findOne({
                where: { id: boulder!.photoable?.id },
                relations: photosAndTopos,
              });
            const routes = await Promise.all(
              (boulder!.routes || []).map(async (_route) => {
                const route = await ds.getRepository(RouteSchema).findOne({
                  where: { id: _route.id },
                  relations: ["photoable"],
                });
                const routePhotoable = await ds
                  .getRepository(PhotoableSchema)
                  .findOne({
                    where: { id: route!.photoable?.id },
                    relations: photosAndTopos,
                  });
                return {
                  ...new Route(route!),
                  photos: routePhotoable?.photos || [],
                };
              })
            );
            return {
              ...new Boulder(boulder!),
              routes,
              photos: boulderPhotoable?.photos || [],
            };
          })
        );
        return {
          ...area,
          photos: areaPhotoable?.photos || [],
          boulders,
        };
      })
    ),
  };
  // console.log(JSON.stringify(json, null, 2));
  console.log(JSON.stringify(json));
  process.exit(0);
}

exportCrag(55);
