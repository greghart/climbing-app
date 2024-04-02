import myDataSource from "../../db/myDataSource.js";
import Trail from "../../models/Trail.js";
import TrailNode from "../../models/TrailNode.js";
import TrailEdge from "../../models/TrailEdge.js";

const setTrail = async (
  trail: Trail,
  nodes: {
    id: string | number;
    lat: number;
    lng: number;
    edges: { a: number; b: number }[];
  }[]
) => {
  const queryRunner = myDataSource.createQueryRunner();
  // await queryRunner.startTransaction();
  const trailNodes = nodes.map((thisNode, i) => {
    const node = new TrailNode(thisNode.lat, thisNode.lng);
    node.trail = trail;
    return node;
  });
  // Remove old trail, if any, and add new ones
  if (trail.id) {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(TrailNode)
      .where("trail = :id", { id: trail.id })
      .execute();
  }
  // We need to save the nodes, and then setup edges once we have ids
  return myDataSource
    .getRepository(TrailNode)
    .save(trailNodes)
    .then((newNodes) => {
      const oldIdToNew = {};
      newNodes.forEach((thisNewNode, i) => {
        oldIdToNew[nodes[i].id] = thisNewNode.id;
      });
      const trailEdges = nodes.reduce((memo, thisNode) => {
        return memo.concat(
          thisNode.edges.map(({ a, b }) => {
            const newEdge = new TrailEdge();
            newEdge.a = oldIdToNew[a];
            newEdge.b = oldIdToNew[b];
            return newEdge;
          })
        );
      }, [] as TrailEdge[]);
      return myDataSource.getRepository(TrailEdge).save(trailEdges);
    });
  // commit transaction now:
  // await queryRunner.commitTransaction();
};

export default setTrail;
