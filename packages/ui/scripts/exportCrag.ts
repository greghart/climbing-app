import resolveCrag from "@/app/api/resolveCrag";
import { AreaSchema, BoulderSchema, CragSchema, getDataSource } from "@/db";
import { Boulder, Crag } from "models";

export default async function exportCrag(id: number) {
  // Validate all grades in our database
  const ds = await getDataSource();
  const _crag = resolveCrag(
    await ds.getRepository(CragSchema).findOne({
      where: { id },
      relations: ["areas", "trail", "trail.lines"],
    })
  );
  if (!_crag) {
    throw new Error(`crag ${id} not found`);
  }
  const crag = Crag.build(_crag);

  const json = {
    ...crag,
    areas: await Promise.all(
      crag.areas.map(async (_area) => {
        const area = await ds.getRepository(AreaSchema).findOne({
          where: { id: _area.id },
          relations: ["boulders", "polygon", "polygon.coordinates"],
        });
        const boulders = await Promise.all(
          (area!.boulders || []).map(async (_boulder) => {
            const boulder = await ds.getRepository(BoulderSchema).findOne({
              where: { id: _boulder.id },
              relations: ["routes", "polygon", "polygon.coordinates"],
            });
            console.warn(boulder, "got a boulder");
            return new Boulder(boulder!);
          })
        );
        return {
          ...area,
          boulders,
        };
      })
    ),
  };
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
}

exportCrag(55);
