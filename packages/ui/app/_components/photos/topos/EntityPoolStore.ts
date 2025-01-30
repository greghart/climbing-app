import { TopogonEntitiesPool, TopogonEntity } from "@/app/api/_actions/getTopo";
import { IArea, IBoulder, IRoute } from "models";

class EntityPoolStore {
  type?: TopogonEntity;
  private entitiesById: { [id: number]: IArea | IBoulder | IRoute };

  constructor(entityPool?: TopogonEntitiesPool) {
    this.type = entityPool?.type;
    this.entitiesById = (entityPool?.entities || []).reduce((acc, entity) => {
      return {
        ...acc,
        [entity.id!.toString()]: entity,
      };
    }, {});
  }

  get entities() {
    console.warn(this.entitiesById);
    return Object.values(this.entitiesById);
  }

  route(id: number) {
    if (this.type !== "route") return;
    return this.entitiesById[id] as IRoute;
  }

  boulder(id: number) {
    if (this.type !== "boulder") return;
    return this.entitiesById[id] as IBoulder;
  }

  area(id: number) {
    if (this.type !== "area") return;
    return this.entitiesById[id] as IArea;
  }
}

export default EntityPoolStore;
