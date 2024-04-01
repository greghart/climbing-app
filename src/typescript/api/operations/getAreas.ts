import myDataSource from "../../db/myDataSource";
import Area from "../../models/Area";

interface Options {
  includeComments: boolean;
}

type Id = string | number;

const getAreas = (
  ids: Id | Id[],
  options: Options = { includeComments: false }
) => {
  const query = myDataSource
    .getRepository(Area)
    .createQueryBuilder("areas")
    .whereInIds(ids)
    .leftJoinAndSelect("areas.boulders", "boulders")
    .leftJoinAndSelect("boulders.routes", "routes")
    .leftJoinAndSelect("areas.crag", "crag")
    .leftJoinAndSelect("areas.polygon", "polygon")
    .leftJoinAndSelect("polygon.coordinates", "coordinates")
    .orderBy({
      "coordinates.order": "ASC",
    });
  if (options.includeComments) {
    query.leftJoinAndSelect("areas.commentable", "commentable");
    query.leftJoinAndSelect("commentable.comments", "comments");
    query.leftJoinAndSelect("comments.user", "user");
    query.orderBy({
      "comments.id": "DESC",
    });
  }

  return query.getMany().then((areas) => {
    // Signal client that we've found comments or not
    if (options.includeComments) {
      areas.forEach((thisArea) => {
        if (thisArea.commentable === undefined) {
          thisArea.commentable = null;
        }
      });
    }
    return areas;
  });
};

export type { Options };
export default getAreas;
