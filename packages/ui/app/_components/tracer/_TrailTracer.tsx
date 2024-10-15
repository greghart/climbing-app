"use client";
import Map from "@/app/_components//explorer/map/Map";
import FullScreen from "@/app/_components/layouts/OverMap";
import PageLayout from "@/app/_components/layouts/PageLayout";
import SearchField from "@/app/_components/search/SearchField";
import TrailPolygon from "@/app/_components/tracer/TrailPolygon";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { IBounds, ICoordinateLiteral, ITrail, Trail } from "models";
import * as React from "react";
import { Circle, Polyline, useMapEvents } from "react-leaflet";

const snapDistance = 1; // in meters -- adjust this value as needed

/**
 * Top level view for TrailTracer component
 *
 * TrailTracer opens full screen, and allows user to click points on a map and save them
 */

interface TrailTracerProps {
  title?: string;
  bounds?: IBounds;
  center: ICoordinateLiteral;
  defaultTrail?: ITrail; // Trail to show on map
  onCancel: React.MouseEventHandler;
  onSubmit?: (b: ITrail) => unknown;
  children?: React.ReactNode;
}

interface TrailTracerState {
  // trail pending submit, just cares about lines
  pending?: ITrail;
  // A start point of a currently being setup line
  start?: Leaflet.LatLngLiteral;
  // An end point of a currently being setup line
  end?: Leaflet.LatLngLiteral;
}

export default function TrailTracer(props: TrailTracerProps) {
  const trail = props.defaultTrail && new Trail(props.defaultTrail);
  const [state, setState] = React.useState<TrailTracerState>({
    ...(trail ? { pending: trail } : {}),
  });

  const snapToExistingPoint = (point: Leaflet.LatLngLiteral) => {
    if (!state.pending) return point;

    for (const line of state.pending?.lines || []) {
      if (Leaflet.latLng(line.start).distanceTo(point) < snapDistance) {
        return line.start;
      }
      if (Leaflet.latLng(line.end).distanceTo(point) < snapDistance) {
        return line.end;
      }
    }
    return point;
  };

  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    // Magnet snap e.latlng to an existing point so that the user can easily connect lines
    const snappedLatLng = snapToExistingPoint(e.latlng);

    // First point
    if (state.start === undefined) {
      setState((state) => ({
        ...state,
        start: snappedLatLng,
      }));
      // Second point
    } else {
      setState((state) => ({
        ...state,
        start: undefined,
        end: undefined,
        pending: {
          lines: [
            ...(state.pending?.lines || []),
            { start: state.start!, end: snappedLatLng },
          ],
        },
      }));
    }
  };

  const handleMouseMove = (e: Leaflet.LeafletMouseEvent) => {
    if (state.start !== undefined) {
      setState((state) => ({
        ...state,
        end: snapToExistingPoint(e.latlng),
      }));
    }
  };

  function getCurrent() {
    return (
      <React.Fragment>
        {state.start && (
          <Circle
            color="green"
            fillColor="green"
            fillOpacity={0.5}
            radius={0.1}
            center={state.start}
          />
        )}
        {state.start && state.end && (
          <Polyline
            key="current-line"
            positions={[state.start, state.end]}
            color="red"
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <>
      <FullScreen zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || "Click twice to add a line"}
              onClickPrepend={props.onCancel}
              prepend={<Cancel />}
              append={<Check />}
              onClickAppend={() => {
                if (state.pending) {
                  props.onSubmit && props.onSubmit(state.pending);
                }
              }}
            />
          }
        />
      </FullScreen>
      <FullScreen zIndex={1000}>
        <Map
          center={props.center}
          bounds={props.bounds}
          style={{ height: "100vh" }}
        >
          <EventsHandler
            handleClick={handleClick}
            handleMouseMove={handleMouseMove}
          />
          {getCurrent()}
          <TrailPolygon trail={state.pending} />
          {props.children}
        </Map>
      </FullScreen>
    </>
  );
}

// Map is a singleton so attach events through hook
interface eventHandlerProps {
  handleClick: (e: Leaflet.LeafletMouseEvent) => void;
  handleMouseMove: (e: Leaflet.LeafletMouseEvent) => void;
}

function EventsHandler(props: eventHandlerProps) {
  useMapEvents({
    click: props.handleClick,
    mousemove: props.handleMouseMove,
  });
  return null;
}
