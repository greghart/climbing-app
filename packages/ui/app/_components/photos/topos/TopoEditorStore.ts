import EntityPoolStore from "@/app/_components/photos/topos/EntityPoolStore";
import TopogonEditorStore, {
  IOptions as TopogonOptions,
} from "@/app/_components/photos/topos/TopogonEditorStore";
import { Topogon } from "@/app/_models";
import { TopogonEntitiesPool } from "@/app/api/_actions/getTopo";
import { action, computed, makeObservable, observable } from "mobx";
import * as models from "models";
import React from "react";

class TopoEditorStore {
  topogonsById: Map<number, Topogon> = new Map();
  selectedTopogonId?: number = undefined;
  hoveredTopogonId?: number = undefined;
  scale: number = 1; // Image scale for this topo
  private topogonOptions: TopogonOptions;
  entityPool: EntityPoolStore;

  constructor(
    photo: models.IPhoto,
    {
      topogonEntitiesPool,
      topogonOptions,
    }: {
      topogonEntitiesPool?: TopogonEntitiesPool;
      topogonOptions: Omit<TopogonOptions, "entityPool">;
    }
  ) {
    this.entityPool = new EntityPoolStore(topogonEntitiesPool);
    this.topogonOptions = {
      ...topogonOptions,
      entityPool: this.entityPool,
    };
    makeObservable(this, {
      topogonsById: observable,
      selectedTopogonId: observable,
      hoveredTopogonId: observable,
      scale: observable,
      selectedTopogon: computed,
      topogons: computed,
      topogonEditor: computed,
      setHoveredTopogonId: action,
      setSelectedTopogonId: action,
      addTopogon: action,
      removeTopogon: action,
      setScale: action,
    });
    this.topogonsById = new Map(
      // TODO: Leaky abstraction
      // We know a photo has relationship ids, but that's technically supposed to be an implementation detail
      (photo.topo?.topogons || []).map((t) => [t.id, new Topogon(t as any)])
    );
  }

  get selectedTopogon() {
    if (this.selectedTopogonId === undefined) return;
    return this.topogonsById.get(this.selectedTopogonId);
  }

  get topogonEditor() {
    if (this.selectedTopogon === undefined) return;
    return new TopogonEditorStore(this.selectedTopogon, this.topogonOptions);
  }

  get topogons() {
    return Array.from(this.topogonsById.values());
  }

  setSelectedTopogonId(id?: number) {
    this.selectedTopogonId = id;
    this.hoveredTopogonId = undefined;
  }

  setHoveredTopogonId(id?: number) {
    this.hoveredTopogonId = id;
  }

  addTopogon() {
    const id = ClientId();
    this.topogonsById.set(
      id,
      new Topogon({
        id,
        label: "",
        routeId: null,
        boulderId: null,
        areaId: null,
      })
    );
    this.setSelectedTopogonId(id);
  }

  removeTopogon(id: number) {
    this.topogonsById.delete(id);
  }

  setScale(_scale: number) {
    const scale = parseFloat(_scale.toFixed(3));
    if (scale === this.scale) return;
    this.scale = scale;
  }

  selectedEntityText(t: Topogon) {
    if (t.selected) {
      switch (this.entityPool.type) {
        case "route":
          const route = this.entityPool.route(t.routeId!)!;
          return `${route.name} (${route.gradeRaw})`;
        case "boulder":
          return this.entityPool.boulder(t.boulderId!)?.name;
        case "area":
          return this.entityPool.area(t.areaId!)?.name;
      }
    }
    return "";
  }
}

let _clientId = 0;
function ClientId() {
  // Generate client ids that can be easily known as "client only" on server.
  _clientId--;
  return _clientId;
}

export const TopoEditorStoreContext = React.createContext<TopoEditorStore>(
  new TopoEditorStore({} as models.IPhoto, { topogonOptions: {} } as any)
);

export default TopoEditorStore;
