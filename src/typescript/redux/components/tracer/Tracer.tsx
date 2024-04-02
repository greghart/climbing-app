/**
 *
 * Top level view for Tracer component
 *
 * Tracer allows user to click points on a map and save them
 */
import * as React from "react";
import * as Leaflet from "leaflet";
import { Map, Polyline, Polygon } from "react-leaflet";
import BestTileLayer from "../BestTileLayer.js";
import FixedContainerOverMap from "../layouts/FixedContainerOverMap.js";
import SearchGroup from "../search/SearchGroup.js";

interface TracerProps {
  bounds: Leaflet.LatLngBoundsExpression;
}

interface TracerState {
  points: Array<Leaflet.LatLngTuple>;
  built: Array<Array<Leaflet.LatLngTuple>>;
  current: Leaflet.LatLngTuple;
}

class Tracer extends React.Component<TracerProps, TracerState> {
  constructor(props) {
    super(props);
    this.state = {
      points: [],
      built: [],
      current: null,
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onControlKeys = this.onControlKeys.bind(this);
  }

  onClick(e) {
    // If it's a "finishing" point, close the polyline and set it as a polygon
    if (
      this.state.points.length > 2 &&
      e.latlng.distanceTo(this.state.points[0]) < 2
    ) {
      this.setState({
        points: [],
        built: this.state.built.concat([this.state.points]),
      });
    } else {
      this.setState({
        points: this.state.points.concat([e.latlng]),
      });
    }
  }

  onMouseMove(e) {
    this.setState({ current: e.latlng });
  }

  onSubmit() {
    // TODO Callback with the list of built polygons
    // Some parent component should build client-side boulders into stores
    // We then go to an "Edit Pending Boulders" mode, which is just a boulder
    // form with a "Save + Next"
  }

  onControlKeys(e: React.KeyboardEvent<any>) {
    e.persist();
    if (e.key === "z") {
      this.undo();
    }
  }

  undo() {
    if (this.state.points.length > 0) {
      this.setState({ points: this.state.points.slice(0, -1) });
    }
  }

  getPoints() {
    // Polyline of all existing points, plus one to cursor
    // We keep them separate for efficiency (base doesn't have to re-render )
    return [
      <Polyline key="current-line" positions={this.state.points} color="red" />,
      this.state.current && this.state.points.length > 0 && (
        <Polyline
          key="current-line-pending"
          positions={[
            this.state.points[this.state.points.length - 1],
            this.state.current,
          ]}
        />
      ),
      this.state.built.map((thisBuilt, i) => {
        return (
          <Polygon key={`built-${i}`} positions={thisBuilt} color="green" />
        );
      }),
    ];
  }

  render() {
    return (
      /** Fill up whatever space is given to the tracer */
      <div className="w-100 h-100" onKeyPress={this.onControlKeys}>
        <FixedContainerOverMap>
          <SearchGroup
            onClickPrepend={() => {}}
            groupClass="flex-no-wrap"
            prepend={<i className="fa fa-check" />}
            input={
              <div className="input-group-append flex-grow-up bg-light align-items-center">
                Trace the boulder's location
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
            center={[32.85052, -117.02223]}
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

export default Tracer;
