/**
 *
 * Top level view for Tracer component
 *
 * Tracer allows user to click points on a map and save them
 * Implemented as a layer which will need to be put in a LayerContainer
 */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LatLngTuple } from 'leaflet';
import { Map, Polyline, Polygon } from 'react-leaflet';
import BestTileLayer from '../BestTileLayer';

interface TracerProps {

}

interface TracerState {
  points: Array<LatLngTuple>;
  built: Array<Array<LatLngTuple>>;
  current: LatLngTuple;
}

class Tracer extends React.Component<any, TracerState> {

  constructor(props) {
    super(props);
    this.state = {
      points: [],
      built: [],
      current: null
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
      e.latlng.distanceTo(this.state.points[0]) < 1
    ) {
      this.setState({
        points: [],
        built: this.state.built.concat([this.state.points])
      });
    } else {
      this.setState({
        points: this.state.points.concat([e.latlng])
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
    if (e.key === 'z') {
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
      <Polyline
        key="current-line"
        positions={this.state.points}
        color="red"
      />,
      (
        this.state.current && this.state.points.length > 0 &&
        <Polyline
          key="current-line-pending"
          positions={[
            this.state.points[this.state.points.length - 1],
            this.state.current
          ]}
        />
      ),
      this.state.built.map((thisBuilt, i) => {
        return (
          <Polygon
            key={`built-${i}`}
            positions={thisBuilt}
            color="green"
          />
        );
      })
    ];
  }

  render() {
    return (
      <div onKeyPress={this.onControlKeys}>
        <h2>Tracer</h2>
        <div className="row">
          <div
            className="col-md-10"
            style={{
              width: '80%',
              height: '80vh'
            }}
          >
            <Map
              ref="map"
              style={{
                width: '100%',
                height: '100%'
              }}
              center={[32.85052, -117.02223]}
              zoom={18}
              minZoom={15}
              maxZoom={22}
              onclick={this.onClick}
              onmousemove={this.onMouseMove}
            >
              <BestTileLayer />
              {this.getPoints()}
            </Map>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-success"
              onClick={this.onSubmit}
            >
              Submit
            </button>
            <hr/>
            <div className="row">
              <div className="col-md-12">
                {/* Controls */}
                <button
                  className="btn"
                  onClick={this.undo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Tracer;
