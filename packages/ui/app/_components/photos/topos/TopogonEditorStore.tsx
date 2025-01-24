import { Line, Topogon } from "@/app/_models";
import { action, computed, makeObservable, observable } from "mobx";
import { TopoData } from "models";

export type Tool = "line" | "text";

export interface IOptions {
  defaultLineColor: string;
  defaultLineTension: number;
}

export default class TopogonEditorStore {
  topogon: Topogon;
  tool: Tool;
  selectedLineIndex?: number;
  defaultLineColor: string;
  defaultLineTension: number;

  constructor(topogon: Topogon, options: IOptions) {
    this.topogon = topogon;
    this.tool = "line";
    this.defaultLineColor = options.defaultLineColor;
    this.defaultLineTension = options.defaultLineTension;
    makeObservable(this, {
      tool: observable,
      selectedLineIndex: observable,
      defaultLineColor: observable,
      defaultLineTension: observable,
      selectedLine: computed,
      lines: computed,
      addLine: action,
      removeSelectedLine: action,
      setSelectedLine: action,
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

  // This should really be "selected components" or something
  setSelectedLine(i?: number) {
    this.selectedLineIndex = i;
  }

  get selectedLine() {
    if (this.selectedLineIndex === undefined) return;

    return this.topogon.data?.lines[this.selectedLineIndex];
  }

  get lines() {
    return this.topogon.data?.lines;
  }

  addLine(points: TopoData.IPoint[]) {
    const line = new Line({
      points: points,
      color: this.defaultLineColor,
      tension: this.defaultLineTension,
    });
    this.lines.push(line);
    this.setSelectedLine(this.lines.length - 1);
  }

  removeSelectedLine() {
    if (this.selectedLineIndex === undefined) return;
    this.lines.splice(this.selectedLineIndex, 1);
    this.setSelectedLine(undefined);
  }

  setLineColor(color: string) {
    this.defaultLineColor = color;
    if (this.selectedLine) this.selectedLine.color = color;
  }

  setLineTension(tension: number) {
    this.defaultLineTension = tension;
    if (this.selectedLine) this.selectedLine.tension = tension;
  }

  // TODO: Allow selecting lines, adding labels, and hook up to our components
}
