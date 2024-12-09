import EventsHandler from "@/app/_components/EventsHandler";
import FullScreen from "@/app/_components/layouts/FullScreen";
import PageLayout from "@/app/_components/layouts/PageLayout";
import Circle from "@/app/_components/map/Circle";
import CragMap from "@/app/_components/map/CragMap";
import Layers from "@/app/_components/map/Layers";
import MyPolygon from "@/app/_components/map/MyPolygon";
import SearchField from "@/app/_components/search/SearchField";
import mapLib from "@/app/_util/mapLib";
import { Cancel, Check } from "@mui/icons-material";
import * as Leaflet from "leaflet";
import { minBy } from "lodash-es";
import { ICoordinateLiteral, ICrag, IPolygon } from "models";
import * as React from "react";

interface PointOnPolygonProps {
  title?: string;
  crag: ICrag;
  polygon: IPolygon;
  defaultCoordinate?: ICoordinateLiteral;
  onCancel: React.MouseEventHandler;
  onSubmit?: (coordinate: ICoordinateLiteral) => unknown;
  children?: React.ReactNode;
  renderPending?: (c: ICoordinateLiteral) => React.ReactNode;
}

interface PointOnPolygonState {
  // Current position of point on polygon (if any)
  current?: ICoordinateLiteral;
  // Pending submit position of chosen point
  pending?: ICoordinateLiteral;
  processedLines: LineData[];
}

export default function PointOnPolygon(props: PointOnPolygonProps) {
  const [state, setState] = React.useState<PointOnPolygonState>({
    pending: props.defaultCoordinate,
    processedLines: processLines(props.polygon.coordinates!),
  });
  React.useEffect(() => {
    setState((state) => ({
      ...state,
      processedLines: processLines(props.polygon.coordinates!),
    }));
  }, [props.polygon.coordinates]);

  if ((props.polygon.coordinates || []).length <= 0) {
    return null;
  }

  const handleClick = (e: Leaflet.LeafletMouseEvent) => {
    setState((state) => ({
      ...state,
      pending: state.current,
    }));
  };

  const handleMouseMove = (e: Leaflet.LeafletMouseEvent) => {
    const closestLine = minBy(state.processedLines, (thisLine) => {
      return mapLib.distToSegmentSquared(
        { x: e.latlng.lng, y: e.latlng.lat },
        { x: thisLine.p1.lng, y: thisLine.p1.lat },
        { x: thisLine.p2.lng, y: thisLine.p2.lat }
      );
    })!;
    const closestPoint = mapLib.closestPoint(
      { x: closestLine.p1.lng, y: closestLine.p1.lat },
      { x: closestLine.p2.lng, y: closestLine.p2.lat },
      { x: e.latlng.lng, y: e.latlng.lat }
    );
    setState((state) => ({
      ...state,
      current: { lat: closestPoint.y, lng: closestPoint.x },
    }));
  };

  const renderGivenPolygon = () => {
    return <MyPolygon positions={props.polygon.coordinates!} />;
  };

  const renderCurrentPoint = () => {
    if (!state.current) {
      return;
    }
    return <Circle style="dynamic" center={state.current} />;
  };

  const renderPending = () => {
    if (!state.pending) {
      return;
    }
    return <Circle center={state.pending} />;
  };

  return (
    <>
      <FullScreen bottom zIndex={1002}>
        <PageLayout
          header={
            <SearchField
              disabled
              value={props.title || "Choose a point on the polygon"}
              PrependButtonProps={{
                onClick: props.onCancel,
                children: <Cancel />,
              }}
              AppendButtonProps={{
                disabled: !state.pending,
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
      <FullScreen zIndex={1001}>
        <CragMap crag={props.crag} style={{ height: "100vh" }}>
          <Layers />
          <EventsHandler click={handleClick} mousemove={handleMouseMove} />
          {renderGivenPolygon()}
          {renderCurrentPoint()}
          {renderPending()}
          {props.children}
        </CragMap>
      </FullScreen>
    </>
  );
}

/**
 * Pre-process our polygon to make calculations easier
 */

interface LineData {
  p1: ICoordinateLiteral;
  p2: ICoordinateLiteral;
  deltaX: number;
  deltaY: number;
  slope: number;
  magnitude: number;
}

function processLines(positions: ICoordinateLiteral[]): LineData[] {
  return positions.map((thisPosition, index) => {
    const endPosition =
      index < positions.length - 1 ? positions[index + 1] : positions[0];
    const deltaX = endPosition.lng - thisPosition.lng;
    const deltaY = endPosition.lat - thisPosition.lat;
    return {
      deltaX,
      deltaY,
      p1: thisPosition,
      p2: endPosition,
      slope: deltaY / deltaX,
      magnitude: mapLib.dist(
        { x: thisPosition.lng, y: thisPosition.lat },
        { x: endPosition.lng, y: endPosition.lat }
      ),
    };
  });
}
