import EntityPoolStore from "@/app/_components/photos/topos/EntityPoolStore";
import { Label, Line, Topogon } from "@/app/_models";
import { action, computed, makeObservable, observable } from "mobx";
import { TopoData } from "models";

export type Tool = "pointer" | "line" | "label";
export type ComponentType = "line" | "label";

export interface IOptions {
  defaultColor: string;
  defaultFillColor: string;
  defaultLineTension: number;
  defaultLabelText: string;
  entityPool: EntityPoolStore;
}

export default class TopogonEditorStore {
  topogon: Topogon;
  tool: Tool;
  selectedComponent?: ComponentType;
  selectedComponentIndex?: number;
  defaultColor: string; // default color to set and use for all components
  defaultFillColor: string; // default color to use for background/fill for all components
  defaultLineTension: number;
  defaultLabelText: string;
  entityPool: EntityPoolStore;

  constructor(topogon: Topogon, options: IOptions) {
    this.topogon = topogon;
    this.tool = "pointer";
    this.defaultColor = options.defaultColor;
    this.defaultFillColor = options.defaultFillColor;
    this.defaultLineTension = options.defaultLineTension;
    this.defaultLabelText = options.defaultLabelText;
    this.entityPool = options.entityPool;
    makeObservable(this, {
      tool: observable,
      selectedComponent: observable,
      selectedComponentIndex: observable,
      defaultColor: observable,
      defaultFillColor: observable,
      defaultLineTension: observable,
      selectedLineIndex: computed,
      selectedLabelIndex: computed,
      selectedLine: computed,
      selectedLabel: computed,
      lines: computed,
      labels: computed,
      entityField: computed,
      entityId: computed,
      addLine: action,
      addLabel: action,
      removeSelectedLine: action,
      removeSelectedLabel: action,
      setSelectedComponent: action,
      setTool: action,
      setColor: action,
      setLineTension: action,
      setEntity: action,
    });
  }

  isEditing(id: number) {
    return this.topogon.id === id;
  }

  setTool(tool: Tool) {
    if (tool === this.tool) return;
    this.tool = tool;
  }

  resetSelectedComponent() {
    this.setSelectedComponent("line", undefined);
  }

  setSelectedComponent(component: ComponentType, i?: number) {
    if (i === undefined && this.selectedComponent !== undefined) {
      this.selectedComponent = undefined;
      this.selectedComponentIndex = undefined;
      return;
    }
    this.selectedComponent = component;
    this.selectedComponentIndex = i;
  }

  setSelectedLine(i?: number) {
    this.setSelectedComponent("line", i);
    this.setTool("line");
  }

  get selectedLineIndex() {
    return this.selectedComponent === "line"
      ? this.selectedComponentIndex
      : undefined;
  }

  get selectedLine() {
    if (this.selectedLineIndex === undefined) return;

    return this.topogon.data?.lines[this.selectedComponentIndex!];
  }

  setSelectedLabel(i?: number) {
    this.setSelectedComponent("label", i);
    this.setTool("label");
  }

  get selectedLabelIndex() {
    return this.selectedComponent === "label"
      ? this.selectedComponentIndex
      : undefined;
  }

  get selectedLabel() {
    if (this.selectedLabelIndex === undefined) return;

    return this.topogon.data?.labels[this.selectedComponentIndex!];
  }

  get lines() {
    return this.topogon.data?.lines;
  }

  get labels() {
    return this.topogon.data?.labels;
  }

  addLine(points: TopoData.IPoint[]) {
    const line = new Line({
      points: points,
      color: this.defaultColor,
      tension: this.defaultLineTension,
    });
    this.lines.push(line);
    this.setSelectedLine(this.lines.length - 1);
  }

  addLabel(point: TopoData.IPoint) {
    const label = new Label({
      text: this.defaultLabelText,
      point: point,
      // Note that labels, we use color for the background (to be consistent with line) and fill for the text
      color: this.defaultFillColor,
      fill: this.defaultColor,
      direction: "up",
    });
    this.labels.push(label);
    this.setSelectedLabel(this.labels.length - 1);
  }

  removeSelectedLine() {
    if (this.selectedLineIndex === undefined) return;
    this.lines.splice(this.selectedLineIndex, 1);
    this.setSelectedLine(undefined);
  }

  removeSelectedLabel() {
    if (this.selectedLabelIndex === undefined) return;
    this.labels.splice(this.selectedLabelIndex, 1);
    this.setSelectedLabel(undefined);
  }

  setColor(color: string) {
    this.defaultColor = color;
    if (this.selectedLine) this.selectedLine.color = color;
    if (this.selectedLabel) this.selectedLabel.fill = color;
  }

  setFill(color: string) {
    this.defaultFillColor = color;
    if (this.selectedLabel) this.selectedLabel.color = color;
  }

  setLineTension(tension: number) {
    this.defaultLineTension = tension;
    if (this.selectedLine) this.selectedLine.tension = tension;
  }

  setText(text: string) {
    this.defaultLabelText = text;
    if (this.selectedLabel) this.selectedLabel.text = text;
  }

  get entityField() {
    // Field of topogon to access
    switch (this.entityPool.type) {
      case "route":
        return "routeId";
      case "boulder":
        return "boulderId";
      case "area":
        return "areaId";
      default:
        return undefined;
    }
  }

  get entityId(): number | null {
    if (!this.entityField) return null;
    return this.topogon[this.entityField];
  }

  setEntity(id: number) {
    this.topogon[this.entityField!] = id;
    // if (this.topogon.label === undefined || this.topogon.label === "") {
    //   this.topogon.label = `${
    //     this.entityPool!.entities.find((e) => e.id === id)!.name
    //   } (${id})`;
    // }
  }
}
