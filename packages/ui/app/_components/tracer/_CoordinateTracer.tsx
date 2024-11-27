"use client";
import EventsHandler from "@/app/_components/EventsHandler";
import FullScreen from "@/app/_components/layouts/FullScreen";
import PageLayout from "@/app/_components/layouts/PageLayout";
import CragMap from "@/app/_components/map/CragMap";
import SearchField from "@/app/_components/search/SearchField";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { ICoordinateLiteral, ICrag } from "models";
import * as React from "react";
import { Marker } from "react-leaflet";

/**
 * CoordinateTracer opens full screen, and allows user to click a point on a map and save it
 */

interface CoordinateTracerProps {
  title?: string;
  crag: ICrag;
  defaultCoordinate?: ICoordinateLiteral;
  onCancel: React.MouseEventHandler;
  onSubmit?: (coordinate: ICoordinateLiteral) => unknown;
  children?: React.ReactNode;
  renderPending?: (c: ICoordinateLiteral) => React.ReactNode;
}
const defaultRenderPending = (c: ICoordinateLiteral) => <Marker position={c} />;

interface CoordinateTracerState {
  pending?: ICoordinateLiteral;
}

export default function CoordinateTracer(props: CoordinateTracerProps) {
  const [state, setState] = React.useState<CoordinateTracerState>({
    pending: props.defaultCoordinate,
  });

  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    setState({ pending: e.latlng });
  };

  return (
    <>
      <FullScreen bottom zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || "Click to place coordinate"}
              PrependButtonProps={{
                children: <Cancel />,
                onClick: props.onCancel,
              }}
              AppendButtonProps={{
                disabled: !Boolean(state.pending),
                children: <Check />,
                onClick: () => {
                  props.onSubmit && props.onSubmit(state.pending!);
                },
              }}
            />
          }
        />
      </FullScreen>
      <FullScreen zIndex={1001}>
        <CragMap crag={props.crag} style={{ height: "100vh" }}>
          <EventsHandler click={handleClick} />
          {state.pending &&
            (props.renderPending || defaultRenderPending)(state.pending)}
          {props.children}
        </CragMap>
      </FullScreen>
    </>
  );
}
