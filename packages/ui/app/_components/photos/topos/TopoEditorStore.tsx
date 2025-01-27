import TopogonEditorStore, {
  IOptions as TopogonOptions,
} from "@/app/_components/photos/topos/TopogonEditorStore";
import { Topogon } from "@/app/_models";
import { action, computed, makeObservable, observable } from "mobx";
import * as models from "models";
import React from "react";

class TopoEditorStore {
  topogonsById: Map<number, Topogon> = new Map();
  selectedTopogonId?: number = undefined;
  hoveredTopogonId?: number = undefined;
  scale: number = 1; // Image scale for this topo
  private topogonOptions: TopogonOptions;

  constructor(
    photo: models.IPhoto,
    { topogonOptions }: { topogonOptions: TopogonOptions }
  ) {
    this.topogonOptions = topogonOptions;
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
      (photo.topo?.topogons || []).map((t) => [t.id, new Topogon(t)])
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
        label: "New topogon",
      })
    );
  }

  removeTopogon(id: number) {
    this.topogonsById.delete(id);
  }

  setScale(_scale: number) {
    const scale = parseFloat(_scale.toFixed(3));
    if (scale === this.scale) return;
    this.scale = scale;
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
