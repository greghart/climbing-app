import { Label, Line, Topogon } from "@/app/_models";
import { action, computed, makeObservable, observable } from "mobx";
import { TopoData } from "models";

export type Tool = "pointer" | "line" | "label";
export type ComponentType = "line" | "label";

export interface IOptions {
  defaultColor: string;
  defaultFillColor: string;
  defaultLineTension: number;
}

export default class TopogonEditorStore {
  topogon: Topogon;
  tool: Tool;
  selectedComponent?: ComponentType;
  selectedComponentIndex?: number;
  defaultColor: string; // default color to set and use for all components
  defaultFillColor: string; // default color to use for background/fill for all components
  defaultLineTension: number;

  constructor(topogon: Topogon, options: IOptions) {
    this.topogon = topogon;
    this.tool = "pointer";
    this.defaultColor = options.defaultColor;
    this.defaultFillColor = options.defaultFillColor;
    this.defaultLineTension = options.defaultLineTension;
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
      addLine: action,
      addLabel: action,
      removeSelectedLine: action,
      removeSelectedLabel: action,
      setSelectedComponent: action,
      setTool: action,
      setLineColor: action,
      setLineTension: action,
    });
  }

  isEditing(id: number) {
    return this.topogon.id === id;
  }

  setTool(tool: Tool) {
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
    console.warn("Adding label @", point);
    const label = new Label({
      text: "New Label",
      point: point,
      color: this.defaultColor,
      fill: this.defaultFillColor,
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

  setLineColor(color: string) {
    this.defaultColor = color;
    if (this.selectedLine) this.selectedLine.color = color;
  }

  setLineTension(tension: number) {
    this.defaultLineTension = tension;
    if (this.selectedLine) this.selectedLine.tension = tension;
  }

  // TODO: Allow selecting lines, adding labels, and hook up to our components
}
