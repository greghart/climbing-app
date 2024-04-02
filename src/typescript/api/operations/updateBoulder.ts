import * as t from "io-ts";
import { getConnection } from "typeorm";
import { omit } from "lodash";

import Boulder from "../../models/Boulder.js";
import BoulderCodec from "../../codecs/BoulderCodec.js";
import setPolygon from "./setPolygon.js";
import PolygonRepository from "../../models/repositories/PolygonRepository.js";
import myDataSource from "../../db/myDataSource.js";

const updateBoulder = async (
  boulder: Boulder,
  data: t.TypeOf<typeof BoulderCodec>
) => {
  return (await getConnection()).transaction((transactionalEntityManager) => {
    return (
      Promise.resolve()
        // Setup polygon if necessary
        .then(async () => {
          if (data.polygon) {
            return setPolygon(
              await myDataSource.manager
                .withRepository(PolygonRepository)
                .findOrGetPolygon(boulder),
              data.polygon.coordinates
            );
          }
        })
        .then(() => {
          Object.assign(boulder, omit(data, "polygon"));
          return transactionalEntityManager.save(boulder);
        })
    );
  });
};

export default updateBoulder;
