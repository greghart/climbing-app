import * as t from "io-ts";
import { getConnection, getCustomRepository } from "typeorm";
import omit from "lodash/omit";

import Boulder from "../../models/Boulder";
import BoulderCodec from "../../codecs/BoulderCodec";
import setPolygon from "./setPolygon";
import PolygonRepository from "../../models/repositories/PolygonRepository";
import myDataSource from "../../db/myDataSource";

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
