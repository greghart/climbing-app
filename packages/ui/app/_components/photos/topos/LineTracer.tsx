"use client";
import Line from "@/app/_components/photos/topos/Line";
import {
  distanceTo,
  Point,
  Points,
  pointsToLine,
} from "@/app/_components/photos/topos/util";
import Konva from "konva";
import * as React from "react";
import { Circle, Layer } from "react-konva";

const snapDistance = 15; // in pixels-- adjust this value as needed

interface Line {
  points: Points;
}

/**
 * A konva layer that, when active, allows the user to draw lines
 */
interface LineTracerProps {
  defaultLine?: Line;
  children?: React.ReactNode;
}

interface LineTracerState {
  // Line pending submit
  line: Line;
  pending?: Point;
}

export default function LineTracer(props: LineTracerProps) {
  const [state, setState] = React.useState<LineTracerState>({
    line: props.defaultLine || {
      points: [],
    },
  });
  const points = state.line.points;

  const snapToExistingPoint = (point: Konva.Vector2d): Point => {
    for (const to of points) {
      if (distanceTo(point.x, point.y, to.x, to.y) < snapDistance) {
        return to;
      }
    }
    return point;
  };

  // Click to add points and lines
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.ctrlKey) return;

    const snapped = snapToExistingPoint(
      e.target.getStage()!.getPointerPosition()!
    );
    console.warn("Clicking!", snapped);

    setState((state) => ({
      ...state,
      line: {
        ...state.line,
        points: [...state.line.points, snapped],
      },
    }));
  };

  // const handleKeyPress = (e: Leaflet.LeafletKeyboardEvent) => {
  // // z to undo last line
  //   if (
  //     e.originalEvent.key === "z" &&
  //     (state.pending?.lines || []).length > 0
  //   ) {
  //     setState((state) => ({
  //       ...state,
  //       pending: {
  //         ...state.pending,
  //         lines: (state.pending?.lines || []).slice(0, -1),
  //       },
  //     }));
  //   }
  //   // space to clear pending line
  //   if (e.originalEvent.key === " " && state.start !== undefined) {
  //     setState((state) => ({
  //       ...state,
  //       start: undefined,
  //       end: undefined,
  //     }));
  //   }
  // };

  // Move mouse to preview the current line being drawn
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (points.length > 0) {
      setState((state) => ({
        ...state,
        pending: snapToExistingPoint(
          e.target.getStage()!.getPointerPosition()!
        ),
      }));
    }
  };

  const getCurrent = () => {
    return (
      <>
        {state.pending && (
          <Line
            points={pointsToLine(points[points.length - 1], state.pending)}
            stroke="red"
          />
        )}
      </>
    );
  };

  /** TODO: Refactor to a tracer layout -- they seem to all have controls, instructions, save, cancel, etc. */
  return (
    <Layer onMouseMove={handleMouseMove} onMouseDown={handleClick}>
      {props.children}
      {getCurrent()}
      <Line points={pointsToLine(...points)} />
      {points.map((p) => (
        <Circle
          color="green"
          fill="green"
          fillOpacity={0.5}
          radius={5}
          x={p.x}
          y={p.y}
        />
      ))}
    </Layer>
  );
}
