"use client";
import LineComponent from "@/app/_components/photos/topos/Line";
import { useTopogonEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import { distanceTo, pointsToLine } from "@/app/_components/photos/topos/util";
import Konva from "konva";
import { observer } from "mobx-react-lite";
import { TopoData } from "models";
import * as React from "react";
import { Layer } from "react-konva";

const snapDistance = 15; // in pixels-- adjust this value as needed

/**
 * A konva layer that, when active, allows the user to draw lines
 */

interface LineTracerProps {
  children?: React.ReactNode;
}

function LineTracer(props: LineTracerProps) {
  const store = useTopogonEditorStore();
  const [pending, setPending] = React.useState<TopoData.IPoint | undefined>(
    undefined
  );
  if (!store) return false;

  // We are either editing an existing line, or about to start a new one
  const points = store.selectedLine?.points || [];

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

    // Start a new one?
    if (!store.selectedLine) {
      store.addLine([snapped]);
    } else {
      store.selectedLine.addPoint(snapped);
    }
  };

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      if (!store.selectedLine) return;

      // z to undo last line
      if (e.key === "z" && store.selectedLine) {
        store.selectedLine.popPoint();
        if (store.selectedLine.points.length === 0) {
          store.removeSelectedLine();
        }
      }
      if (e.key === " ") {
        if (store.selectedLine.points.length <= 1) {
          store.removeSelectedLine();
        } else {
          store.setSelectedLine(undefined);
        }
      }
      if (e.key === "x") {
        store.removeSelectedLine();
      }
    },
    [store.selectedLine]
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
    setPending(snapToExistingPoint(e.target.getStage()!.getPointerPosition()!));
  };

  const displayPending = () => {
    return (
      <>
        {pending && points.length > 0 && (
          <LineComponent
            points={pointsToLine(points[points.length - 1], pending)}
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
      {displayPending()}
    </Layer>
  );
}

export default observer(LineTracer);
