/**
 * Top level view for PolygonTracer component
 *
 * PolygonTracer allows user to click points on a map and save them
 */
import * as React from "react";
import * as Leaflet from "leaflet";
import { Map, Polyline } from "react-leaflet";
import BestTileLayer from "../BestTileLayer.js";
import FixedContainerOverMap from "../layouts/FixedContainerOverMap.js";
import SearchGroup from "../search/SearchGroup.js";
import MyPolygon from "../map/MyPolygon.js";

interface PolygonTracerProps {
  title?: string;
  magnetSizeMeters?: number;
  bounds: Leaflet.LatLngBoundsExpression;
  onCancel: React.MouseEventHandler;
  onSubmit?: (coordinates: Leaflet.LatLngLiteral[]) => unknown;
  onPolygonComplete?: (coordinates: Leaflet.LatLngLiteral[]) => unknown;
}

interface PolygonTracerState {
  points: Array<Leaflet.LatLngLiteral>;
  current: Leaflet.LatLngTuple;
  isDone: boolean;
}

class PolygonTracer extends React.Component<
  PolygonTracerProps,
  PolygonTracerState
> {
  static defaultProps = {
    title: "Trace",
    magnetSizeMeters: 16,
  };

  constructor(props) {
    super(props);
    this.state = {
      points: [],
      current: null,
      isDone: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onControlKeys = this.onControlKeys.bind(this);
  }

  onClick(e) {
    if (this.state.isDone) {
      return;
    }
    // If it's a "finishing" point, 'close' the polyline and set it as a polygon
    if (
      this.state.points.length > 2 &&
      e.latlng.distanceTo(this.state.points[0]) < this.props.magnetSizeMeters
    ) {
      const newPoints = this.state.points.concat([this.state.points[0]]);
      this.setState({
        points: newPoints,
        isDone: true,
      });
      if (this.props.onPolygonComplete) {
        this.props.onPolygonComplete(newPoints);
      }
    } else {
      this.setState({
        points: this.state.points.concat([e.latlng]),
      });
    }
  }

  onMouseMove(e) {
    this.setState({ current: e.latlng });
  }

  onControlKeys(e: React.KeyboardEvent<any>) {
    e.persist();
    if (e.key === "z") {
      this.undo();
    }
  }

  undo() {
    if (this.state.points.length > 0) {
      this.setState({
        points: this.state.points.slice(0, -1),
        isDone: false,
      });
    }
  }

  getPoints() {
    if (this.state.isDone) {
      return (
        <MyPolygon
          positions={this.state.points}
          fillColor="#00d103"
          dashArray=""
        />
      );
    }
    // Polyline of all existing points, plus one to cursor
    // We keep them separate for efficiency (base doesn't have to re-render )
    return [
      <Polyline key="current-line" positions={this.state.points} color="red" />,
      this.state.current &&
        this.state.points.length > 0 &&
        !this.state.isDone && (
          <Polyline
            key="current-line-pending"
            positions={[
              this.state.points[this.state.points.length - 1],
              this.state.current,
            ]}
          />
        ),
    ];
  }

  getInput() {
    return (
      <div className="input-group-append flex-grow-up bg-light align-items-center text-center">
        <div className="col">{this.props.title} (z to undo)</div>
        <div className="col-auto">
          {this.state.isDone && (
            <a
              role="button"
              className="btn btn-link"
              onClick={() =>
                this.props.onSubmit && this.props.onSubmit(this.state.points)
              }
            >
              <i className="fa fa-check pull-right" />
            </a>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      /** Fill up whatever space is given to the tracer */
      <div className="w-100 h-100" onKeyPress={this.onControlKeys}>
        <FixedContainerOverMap>
          <SearchGroup
            onClickPrepend={this.props.onCancel}
            groupClass="flex-no-wrap"
            prepend={<i className="fa fa-times-circle" />}
            input={this.getInput()}
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
            style={{
              width: "100%",
              height: "100%",
            }}
            bounds={this.props.bounds}
            zoom={18}
            minZoom={15}
            maxZoom={22}
            zoomControl={false}
            onclick={this.onClick}
            onmousemove={this.onMouseMove}
          >
            <BestTileLayer />
            {this.props.children}
            {this.getPoints()}
          </Map>
        </div>
      </div>
    );
  }
}

export default PolygonTracer;
