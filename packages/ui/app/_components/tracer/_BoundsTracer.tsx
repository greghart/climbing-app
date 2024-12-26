"use client";
import EventsHandler from "@/app/_components/EventsHandler";
import FullScreen from "@/app/_components/layouts/FullScreen";
import PageLayout from "@/app/_components/layouts/PageLayout";
import CragMap from "@/app/_components/map/CragMap";
import Layers from "@/app/_components/map/Layers";
import SearchField from "@/app/_components/search/SearchField";
import BoundsPolygon from "@/app/_components/tracer/BoundsPolygon";
import getRectangle from "@/app/_components/tracer/getRectangle";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { Bounds, IBounds, ICrag } from "models";
import * as React from "react";
import { Circle, Polyline } from "react-leaflet";

/**
 * BoundsTracer opens full screen, and allows user to click points on a map and save them
 */

interface BoundsTracerProps {
  title?: string;
  crag: ICrag;
  defaultBounds?: IBounds; // Bounds to show on map
  onCancel: React.MouseEventHandler;
  onSubmit?: (b: IBounds) => unknown;
  children?: React.ReactNode;
  layersChildren?: React.ComponentProps<typeof Layers>["children"];
}

interface BoundsTracerState {
  // A rectangle pending submit
  pending?: IBounds;
  // A start point of a currently being setup rectangle
  start?: Leaflet.LatLngLiteral;
  // An end point of a currently being setup rectangle
  end?: Leaflet.LatLngLiteral;
}

export default function BoundsTracer(props: BoundsTracerProps) {
  const bounds = props.defaultBounds && new Bounds(props.defaultBounds);
  const [state, setState] = React.useState<BoundsTracerState>({
    ...(bounds ? { pending: bounds } : {}),
  });

  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    // First point
    if (state.start === undefined) {
      setState({
        start: e.latlng,
      });
      // Second point
    } else {
      setState((state) => ({
        ...state,
        start: undefined,
        end: undefined,
        pending: { topLeft: state.start!, bottomRight: e.latlng },
      }));
    }
  };

  const handleMouseMove = (e: Leaflet.LeafletMouseEvent) => {
    if (state.start !== undefined) {
      setState((state) => ({
        ...state,
        end: e.latlng,
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
            positions={getRectangle({
              topLeft: state.start,
              bottomRight: state.end,
            })}
            color="red"
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <FullScreen bottom zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || "Click twice to make a rectangle"}
              PrependButtonProps={{
                children: <Cancel />,
                onClick: props.onCancel,
              }}
              AppendButtonProps={{
                children: <Check />,
                onClick: () => {
                  if (state.pending) {
                    props.onSubmit && props.onSubmit(state.pending);
                  }
                },
              }}
            />
          }
        />
      </FullScreen>
      <FullScreen zIndex={1000}>
        <CragMap crag={props.crag} style={{ height: "100vh" }}>
          <EventsHandler click={handleClick} mousemove={handleMouseMove} />
          {getCurrent()}
          <BoundsPolygon bounds={state.pending} />
          {props.children}
          <Layers>{props.layersChildren}</Layers>
        </CragMap>
      </FullScreen>
    </>
  );
}
