"use client";
import Line from "@/app/_components/photos/topos/Line";
import { distanceTo, pointsToLine } from "@/app/_components/photos/topos/util";
import Konva from "konva";
import { TopoData } from "models";
import * as React from "react";
import { Circle, Layer } from "react-konva";

const snapDistance = 15; // in pixels-- adjust this value as needed

/**
 * A konva layer that, when active, allows the user to draw lines
 */
interface LineTracerProps {
  defaultLine?: TopoData.ILine;
  children?: React.ReactNode;
  onFinish?: (line: TopoData.ILine) => unknown;
}

interface LineTracerState {
  // Line pending submit
  line: TopoData.ILine;
  // Pending point to be added (if any)
  pending?: TopoData.IPoint;
}

export default function LineTracer(props: LineTracerProps) {
  const lineRef = React.useRef<Konva.Line>(null);
  const [state, setState] = React.useState<LineTracerState>({
    line: props.defaultLine || {
      points: [],
    },
  });
  const points = state.line.points;

  const snapToExistingPoint = (point: Konva.Vector2d): TopoData.IPoint => {
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

    setState((state) => ({
      ...state,
      line: {
        ...state.line,
        points: [...state.line.points, snapped],
      },
    }));
  };

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      console.warn("keypress", e.key, state.line.points.length);
      // z to undo last line
      if (e.key === "z" && state.line.points.length > 0) {
        setState((state) => ({
          ...state,
          line: {
            ...state.line,
            points: state.line.points.slice(0, -1),
          },
        }));
      }
      if (e.key === " " && state.line.points.length > 1) {
        console.warn("Finishing line");
        setState((state) => ({
          line: { points: [] },
        }));
        // Finish line
        props.onFinish && props.onFinish(state.line);
      }
    },
    [state.line.points]
  );

  // Get konva container for keypresses
  const layerRef = React.useRef<Konva.Layer>(null);
  React.useEffect(() => {
    if (!layerRef.current) return;
    const container = layerRef.current.getStage().container();
    container.tabIndex = 1;
    container.focus();
    container.addEventListener("keypress", handleKeyPress);
    return () => container.removeEventListener("keypress", handleKeyPress);
  }, [layerRef.current, handleKeyPress]);

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
        {state.pending && points.length > 0 && (
          <Line
            points={pointsToLine(points[points.length - 1], state.pending)}
            stroke="red"
          />
        )}
      </>
    );
  };

  return (
    <Layer
      onMouseMove={handleMouseMove}
      onMouseDown={handleClick}
      ref={layerRef}
    >
      {props.children}
      {getCurrent()}
      <Line points={pointsToLine(...points)} ref={lineRef} />
      {points.map((p) => (
        <Circle
          key={`${p.x},${p.y}`}
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
