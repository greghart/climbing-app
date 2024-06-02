import { Crag, getDataSource } from "@/db";
import { CragSchema } from "@/db/entity/Crag";
import "server-only";

interface Data {
  name?: string;
  description?: string;
}

const updateCrag = async (crag: CragSchema, data: Data) => {
  console.warn({ data }, "updateCrag");
  const ds = await getDataSource();
  return await ds.transaction(async (transactionalEntityManager) => {
    Object.assign(crag, data);
    return transactionalEntityManager.getRepository(Crag).save(crag);
  });
  // return await myDataSource.transaction((transactionalEntityManager) => {
  //   return (
  //     Promise.resolve()
  //       // Setup trail if necessary
  //       .then(async () => {
  //         if (data.trail) {
  //           console.warn("setting trail");
  //           return setTrail(
  //             await myDataSource.manager
  //               .withRepository(TrailRepository)
  //               .findOrGetTrail(crag),
  //             data.trail.nodes
  //           );
  //         }
  //       })
  //       // Setup bounds if necessary
  //       .then(async () => {
  //         if (!data.bounds) {
  //           return;
  //         }
  //         const bounds = crag.bounds || new Bounds();
  //         bounds.topLeft = new Coordinate(
  //           data.bounds.topLeft.lat,
  //           data.bounds.topLeft.lng
  //         );
  //         bounds.bottomRight = new Coordinate(
  //           data.bounds.bottomRight.lat,
  //           data.bounds.bottomRight.lng
  //         );
  //         bounds.crag = crag;
  //         await transactionalEntityManager.save(bounds);
  //         delete bounds.crag;
  //         crag.bounds = bounds;
  //       })
  //       .then(() => {
  //         Object.assign(crag, omit(data, "trail", "bounds"));
  //         debug({ crag }, "save");
  //         return transactionalEntityManager.save(crag);
  //       })
  //   );
  // });
};

export default updateCrag;
