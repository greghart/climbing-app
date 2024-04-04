import * as t from "io-ts";
import { omit } from "lodash-es";

import myDataSource from "../../db/myDataSource.js";
import Area from "../../models/Area.js";
import AreaCodec from "../../codecs/AreaCodec.js";
import setPolygon from "./setPolygon.js";
import PolygonRepository from "../../models/repositories/PolygonRepository.js";

const updateArea = async (area: Area, data: t.TypeOf<typeof AreaCodec>) => {
  return myDataSource.transaction((transactionalEntityManager) => {
    return (
      Promise.resolve()
        // Setup polygon if necessary
        .then(async () => {
          if (data.polygon) {
            return setPolygon(
              await myDataSource.manager
                .withRepository(PolygonRepository)
                .findOrGetPolygon(area),
              data.polygon.coordinates
            );
          }
        })
        .then(() => {
          Object.assign(area, omit(data, "polygon"));
          return transactionalEntityManager.save(area);
        })
    );
  });
};

export default updateArea;
