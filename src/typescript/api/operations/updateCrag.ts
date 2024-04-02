import * as t from "io-ts";
import { omit } from "lodash";

import myDataSource from "../../db/myDataSource.js";
import Crag from "../../models/Crag.js";
import CragCodec from "../../codecs/CragCodec.js";
import setTrail from "./setTrail.js";
import TrailRepository from "../../models/repositories/TrailRepository.js";
import Coordinate from "../../models/Coordinate.js";
import Bounds from "../../models/Bounds.js";
import _debug from "../../debug.js";
const debug = _debug.extend("api:operations:updateCrag");

const updateCrag = async (crag: Crag, data: t.TypeOf<typeof CragCodec>) => {
  console.warn({ data }, "updateCrag");
  return await myDataSource.transaction((transactionalEntityManager) => {
    return (
      Promise.resolve()
        // Setup trail if necessary
        .then(async () => {
          if (data.trail) {
            console.warn("setting trail");
            return setTrail(
              await myDataSource.manager
                .withRepository(TrailRepository)
                .findOrGetTrail(crag),
              data.trail.nodes
            );
          }
        })
        // Setup bounds if necessary
        .then(async () => {
          if (!data.bounds) {
            return;
          }
          const bounds = crag.bounds || new Bounds();
          bounds.topLeft = new Coordinate(
            data.bounds.topLeft.lat,
            data.bounds.topLeft.lng
          );
          bounds.bottomRight = new Coordinate(
            data.bounds.bottomRight.lat,
            data.bounds.bottomRight.lng
          );
          bounds.crag = crag;
          await transactionalEntityManager.save(bounds);
          delete bounds.crag;
          crag.bounds = bounds;
        })
        .then(() => {
          Object.assign(crag, omit(data, "trail", "bounds"));
          debug({ crag }, "save");
          return transactionalEntityManager.save(crag);
        })
    );
  });
};

export default updateCrag;
