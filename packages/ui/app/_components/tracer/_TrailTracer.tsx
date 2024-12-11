"use client";
import EventsHandler from "@/app/_components/EventsHandler";
import FullScreen from "@/app/_components/layouts/FullScreen";
import PageLayout from "@/app/_components/layouts/PageLayout";
import CragMap from "@/app/_components/map/CragMap";
import Layers from "@/app/_components/map/Layers";
import SearchField from "@/app/_components/search/SearchField";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { ICrag, ITrail, Trail } from "models";
import * as React from "react";
import { Circle, Polyline, Tooltip } from "react-leaflet";

const snapDistance = 2; // in meters -- adjust this value as neede
const instructions = `Click to add lines.
Z to undo last line.
Space to clear pending line.`;
/**
 * Top level view for TrailTracer component
 *
 * TrailTracer opens full screen, and allows user to click points on a map and save them
 */
interface TrailTracerProps {
  title?: string;
  crag: ICrag;
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

  // Click to add points and lines
  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    console.warn("handling click");
    if (e.originalEvent.ctrlKey) return;

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
        start: snappedLatLng,
        end: undefined,
        pending: {
          ...state.pending,
          lines: [
            ...(state.pending?.lines || []),
            { start: state.start!, end: snappedLatLng },
          ],
        },
      }));
    }
  };

  const handleKeyPress = (e: Leaflet.LeafletKeyboardEvent) => {
    console.warn("handleKeyPress", e.originalEvent.key);
    // z to undo last line
    if (
      e.originalEvent.key === "z" &&
      (state.pending?.lines || []).length > 0
    ) {
      setState((state) => ({
        ...state,
        pending: {
          ...state.pending,
          lines: (state.pending?.lines || []).slice(0, -1),
        },
      }));
    }
    // space to clear pending line
    if (e.originalEvent.key === " " && state.start !== undefined) {
      setState((state) => ({
        ...state,
        start: undefined,
        end: undefined,
      }));
    }
  };

  // Move mouse to preview the current line being drawn
  const handleMouseMove = (e: Leaflet.LeafletMouseEvent) => {
    if (state.start !== undefined) {
      setState((state) => ({
        ...state,
        end: snapToExistingPoint(e.latlng),
      }));
    }
  };

  const getCurrent = () => {
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
            weight={3}
          />
        )}
      </React.Fragment>
    );
  };

  /** TODO: Refactor to a tracer layout -- they seem to all have controls, instructions, save, cancel, etc. */
  return (
    <>
      <FullScreen bottom zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || instructions}
              multiline
              rows={3}
              PrependButtonProps={{
                onClick: props.onCancel,
                children: <Cancel />,
              }}
              AppendButtonProps={{
                onClick: () =>
                  state.pending &&
                  props.onSubmit &&
                  props.onSubmit(state.pending),
                children: <Check />,
              }}
            />
          }
        />
      </FullScreen>
      <FullScreen zIndex={1000}>
        <CragMap crag={props.crag} style={{ height: "100vh" }}>
          <Layers />
          <EventsHandler
            click={handleClick}
            mousemove={handleMouseMove}
            keypress={handleKeyPress}
          />
          {getCurrent()}
          {/** Separate lines that can be removed */}
          {(state.pending?.lines || []).map((l, i) => (
            <TrailPolyline
              key={[l.start.lat, l.start.lng, l.end.lat, l.end.lng].join(",")}
              lines={[l]}
              /** Increase weight since user can interact with them */
              weight={6}
              eventHandlers={{
                click: (e) => {
                  if (e.originalEvent.ctrlKey) {
                    const check = JSON.stringify(l);
                    setState((state) => ({
                      ...state,
                      pending: {
                        ...state.pending,
                        lines: state.pending!.lines!.filter(
                          (line) => JSON.stringify(line) !== check
                        ),
                      },
                    }));
                  }
                },
              }}
            >
              <Tooltip sticky>Ctrl click to delete line</Tooltip>
            </TrailPolyline>
          ))}
          {props.children}
        </CragMap>
      </FullScreen>
    </>
  );
}
