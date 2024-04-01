/**
 * Set a point on a given polygon
 *
 * First the user will click a line.
 * Then the user can drag a point down the distance of that line.
 */
import * as React from "react";
import type { LatLngTuple, LatLng } from "leaflet";
import { Map, Circle } from "react-leaflet";
import minBy from "lodash/minBy";

import * as mapLib from "../../../util/mapLib";
import BestTileLayer from "../BestTileLayer";
import FixedContainerOverMap from "../layouts/FixedContainerOverMap";
import SearchGroup from "../search/SearchGroup";
import MyPolygon from "../map/MyPolygon";
import ConfirmedCircle from "./ConfirmedCircle";

/**
 * Compute some data about lines between positions.
 */
interface LineData {
  p1: LatLngTuple;
  p2: LatLngTuple;
  deltaX: number;
  deltaY: number;
  slope: number;
  magnitude: number;
}
function processLines(positions: LatLngTuple[]): LineData[] {
  return positions.map((thisPosition, index) => {
    const endPosition =
      index < positions.length - 1 ? positions[index + 1] : positions[0];
    const deltaX = endPosition[1] - thisPosition[1];
    const deltaY = endPosition[0] - thisPosition[0];
    return {
      deltaX,
      deltaY,
      p1: thisPosition,
      p2: endPosition,
      slope: deltaY / deltaX,
      magnitude: mapLib.dist(
        { x: thisPosition[1], y: thisPosition[0] },
        { x: endPosition[1], y: endPosition[0] }
      ),
    };
  });
}

interface PointOnPolygonProps {
  positions: LatLngTuple[];
  onSubmit?: (coordinates: LatLngTuple) => unknown;
  onCancel?: React.MouseEventHandler;
}

interface PointOnPolygonState {
  currentPoint: LatLngTuple;
  currentDistance: number;
  confirmed?: LatLngTuple;
  // Computed data for perf
  processedLines: LineData[];
  // Track previous position for tracking
  _previous?: LatLng;
}

class PointOnPolygon extends React.Component<
  PointOnPolygonProps,
  PointOnPolygonState
> {
  constructor(props) {
    super(props);
    this.state = {
      currentPoint: undefined,
      currentDistance: 0,
      confirmed: undefined,
      processedLines: processLines(props.positions),
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.positions !== this.props.positions) {
      this.setState({ processedLines: processLines(nextProps) });
    }
  }

  onClick(e) {
    // Set the temporarily confirmed point
    this.setState({
      confirmed: this.state.currentPoint,
    });
  }

  onMouseMove(e) {
    const closestLine = minBy(this.state.processedLines, (thisLine) => {
      return mapLib.distToSegmentSquared(
        { x: e.latlng.lng, y: e.latlng.lat },
        { x: thisLine.p1[1], y: thisLine.p1[0] },
        { x: thisLine.p2[1], y: thisLine.p2[0] }
      );
    });
    const closestPoint = mapLib.closestPoint(
      { x: closestLine.p1[1], y: closestLine.p1[0] },
      { x: closestLine.p2[1], y: closestLine.p2[0] },
      { x: e.latlng.lng, y: e.latlng.lat }
    );
    this.setState({
      currentPoint: [closestPoint.y, closestPoint.x],
    });
  }

  renderGivenPolygon() {
    return <MyPolygon positions={this.props.positions} />;
  }

  renderCurrentPoint() {
    if (!this.state.currentPoint) {
      return;
    }
    return (
      <Circle
        color="green"
        fillColor="green"
        fillOpacity={0.5}
        radius={0.1}
        center={this.state.currentPoint}
      />
    );
  }

  renderConfirmed() {
    if (!this.state.confirmed) {
      return;
    }
    return <ConfirmedCircle center={this.state.confirmed} />;
  }

  render() {
    return (
      /** Fill up whatever space is given to the tracer */
      <div className="w-100 h-100">
        <FixedContainerOverMap>
          <SearchGroup
            onClickPrepend={this.props.onCancel}
            groupClass="flex-no-wrap"
            prepend={<i className="fa fa-times-circle" />}
            input={
              <div className="input-group-append flex-grow-up bg-light align-items-center">
                <div className="col">
                  Choose a line and the point on that line.
                </div>
                <div className="col-auto">
                  {this.state.confirmed && (
                    <a
                      role="button"
                      className="btn btn-link"
                      onClick={() =>
                        this.props.onSubmit &&
                        this.props.onSubmit(this.state.confirmed)
                      }
                    >
                      <i className="fa fa-check pull-right" />
                    </a>
                  )}
                </div>
              </div>
            }
          />
        </FixedContainerOverMap>
        <div
          className="row no-gutters"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Map
            ref="map"
            style={{
              width: "100%",
              height: "100%",
            }}
            bounds={this.props.positions}
            zoom={18}
            minZoom={15}
            maxZoom={22}
            zoomControl={false}
            onclick={this.onClick}
            onmousemove={this.onMouseMove}
          >
            <BestTileLayer />
            {this.renderGivenPolygon()}
            {this.renderCurrentPoint()}
            {this.renderConfirmed()}
            {this.props.children}
          </Map>
        </div>
      </div>
    );
  }
}

export type { PointOnPolygonProps };
export default PointOnPolygon;
