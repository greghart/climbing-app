"use client";
import MyPolygon from "@/app/_components/explorer/map/MyPolygon";
import FullScreen from "@/app/_components/layouts/OverMap";
import PageLayout from "@/app/_components/layouts/PageLayout";
import CragMap from "@/app/_components/map/CragMap";
import SearchField from "@/app/_components/search/SearchField";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { ICoordinateLiteral, ICrag, IPolygon } from "models";
import * as React from "react";
import { Polyline, useMapEvents } from "react-leaflet";

/**
 * Top level view for PolygonTracer component
 *
 * PolygonTracer opens full screen, and allows user to click points on a map and save them
 */

interface PolygonTracerProps {
  title?: string;
  defaultPolygon?: IPolygon; // Polygon to show on map
  crag: ICrag;
  onCancel: React.MouseEventHandler;
  onSubmit?: (b: IPolygon) => unknown;
  children?: React.ReactNode;
  snapDistance?: number; // Add this line
}

interface PolygonTracerState {
  // polygon pending submit, just cares about lines
  pending?: IPolygon;
  current?: ICoordinateLiteral;
  isDone: boolean;
}

export default function PolygonTracer(props: PolygonTracerProps) {
  // TODO: System wide settings like snap distance for points
  const snapDistance = props.snapDistance || 4; // in meters -- adjust this value as needed
  const [state, setState] = React.useState<PolygonTracerState>({
    pending: props.defaultPolygon,
    isDone: (props.defaultPolygon?.coordinates || []).length > 0,
  });
  const coordinates = state.pending?.coordinates || [];

  // TODO: If client perf gets bad, store in a heap to make point lookups faster
  const snapToStart = (point: Leaflet.LatLngLiteral) => {
    if (coordinates.length <= 2) {
      // At least a triangle
      return point;
    }
    if (Leaflet.latLng(coordinates[0]).distanceTo(point) < snapDistance) {
      return coordinates[0];
    }
    return point;
  };

  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    if (state.isDone) {
      return;
    }
    // If it's a "finishing" point, 'close' the polyline and set it as a polygon
    if (snapToStart(e.latlng) === coordinates[0]) {
      setState((state) => ({
        ...state,
        isDone: true,
      }));
    } else {
      setState((state) => ({
        ...state,
        pending: {
          ...state.pending,
          coordinates: coordinates.concat([e.latlng]),
        },
      }));
    }
  };

  const handleMouseMove = (e: Leaflet.LeafletMouseEvent) => {
    setState((state) => ({
      ...state,
      current: snapToStart(e.latlng),
    }));
  };

  const handleKeyPress = (e: Leaflet.LeafletKeyboardEvent) => {
    if (e.originalEvent.key === "z" && coordinates.length > 0) {
      if (state.isDone) {
        setState((state) => ({
          ...state,
          isDone: false,
        }));
      } else {
        setState((state) => ({
          ...state,
          pending: {
            ...state.pending,
            coordinates: coordinates.slice(0, -1),
          },
          isDone: false,
        }));
      }
    }
  };

  const getCoordinates = () => {
    if (state.isDone) {
      return (
        <MyPolygon positions={coordinates} fillColor="#00d103" dashArray="" />
      );
    }
    // Polyline of all existing points, plus one to cursor
    // We keep them separate for efficiency (base doesn't have to re-render )
    return (
      <>
        <Polyline key="current-line" positions={coordinates} color="red" />
        {state.current && coordinates.length > 0 && !state.isDone && (
          <Polyline
            key="current-line-pending"
            positions={[coordinates[coordinates.length - 1], state.current]}
          />
        )}
      </>
    );
  };

  return (
    <>
      <FullScreen zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || "Click to add points (z to undo)"}
              PrependButtonProps={{
                onClick: props.onCancel,
                children: <Cancel />,
              }}
              AppendButtonProps={{
                disabled: !state.isDone,
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
          <EventsHandler
            handleClick={handleClick}
            handleMouseMove={handleMouseMove}
            handleKeyPress={handleKeyPress}
          />
          {getCoordinates()}
          {props.children}
        </CragMap>
      </FullScreen>
    </>
  );
}

// Map is a singleton so attach events through hook
interface eventHandlerProps {
  handleClick: (e: Leaflet.LeafletMouseEvent) => void;
  handleMouseMove: (e: Leaflet.LeafletMouseEvent) => void;
  handleKeyPress: (e: Leaflet.LeafletKeyboardEvent) => void;
}

function EventsHandler(props: eventHandlerProps) {
  useMapEvents({
    click: props.handleClick,
    mousemove: props.handleMouseMove,
    keypress: props.handleKeyPress,
  });
  return null;
}
