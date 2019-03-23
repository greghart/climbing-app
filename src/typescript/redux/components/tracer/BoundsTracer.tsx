/**
 * Top level view for BoundsTracer component
 *
 * BoundsTracer allows user to click points on a map and save them
 */
import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, Polyline, Circle } from 'react-leaflet';
import BestTileLayer from '../BestTileLayer';
import FixedContainerOverMap from '../layouts/FixedContainerOverMap';
import SearchGroup from '../search/SearchGroup';
import BaseMap from '../map/BaseMap';

// To model a bounds we just need two points. We normalize this to the
// upper left and bottom right for consistency with backend and libs.
interface BoundsTracerProps {
  title?: string;
  bounds: Leaflet.LatLngBoundsExpression;
  onCancel: React.MouseEventHandler;
  onSubmit?: (upperLeft: Leaflet.LatLngLiteral, bottomRight: Leaflet.LatLngLiteral) => unknown;
}

interface BoundsTracerState {
  // A rectangle pending submit
  pending?: [Leaflet.LatLngLiteral, Leaflet.LatLngLiteral];
  // A start point of a currently being setup rectangle
  start?: Leaflet.LatLngLiteral;
  // An end point of a currently being setup rectangle
  end?: Leaflet.LatLngLiteral;
}

class BoundsTracer extends React.Component<BoundsTracerProps, BoundsTracerState> {

  static defaultProps = {
    title: 'Draw Rectangle For Bounds'
  };

  constructor(props) {
    super(props);
    this.state = {
      pending: null,
      start: null,
      end: null
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onDragStart(e) {
    // console.log('onDragStart');
    // console.log(e);
    // this.setState({
    //   start: e.target._lastCenter
    // });
    // this.forceUpdate();
    // return false;
  }

  onDragEnd(e) {
  }

  onDrag(e) {
    // e.originalEvent.preventDefault();
    // e.originalEvent.stopPropagation();
    // console.log(e);
    // console.log('onDrag');
    // return false;
  }

  onClick(e: Leaflet.LeafletMouseEvent) {
    // First point
    if (this.state.start === null) {
      this.setState({
        start: e.latlng
      });
    // Second point
    } else if (this.state.start !== null) {
      this.setState({
        start: null,
        end: null,
        pending: [this.state.start, e.latlng]
      });
    }
  }

  onMouseMove(e: Leaflet.LeafletMouseEvent) {
    if (this.state.start !== null) {
      this.setState({
        end: e.latlng
      });
    }
  }

  getInput() {
    return (
      <div className="input-group-append flex-grow-up bg-light align-items-center text-center">
        <div className="col">
          {this.props.title} (z to undo)
        </div>
        <div className="col-auto">
          {this.state.pending &&
            <a
              role="button"
              className="btn btn-link"
              onClick={() => this.props.onSubmit && this.props.onSubmit(...this.state.pending)}
            >
              <i className="fa fa-check pull-right"/>
            </a>
          }
        </div>
      </div>
    );
  }

  getRectangle(pointA: Leaflet.LatLngLiteral, pointB: Leaflet.LatLngLiteral) {
    return [
      pointA,
      [pointA.lat, pointB.lng],
      pointB,
      [pointB.lat, pointA.lng],
      pointA
    ] as [number, number][];
  }

  getPending() {
    if (!this.state.pending) {
      return;
    }
    return (
      <Polyline
        positions={this.getRectangle(...this.state.pending)}
        color="green"
      />
    );
  }
  getCurrent() {
    return (
      <React.Fragment>
        {this.state.start && (
          <Circle
            color="green"
            fillColor="green"
            fillOpacity={.5}
            radius={.1}
            center={this.state.start}
          />
        )}
        {this.state.start && this.state.end && (
          <Polyline
            key="current-line"
            positions={this.getRectangle(this.state.start, this.state.end)}
            color="red"
          />
        )}
      </React.Fragment>
    );
  }

  render() {
    return (
      /** Fill up whatever space is given to the tracer */
      <div className="w-100 h-100">
        <FixedContainerOverMap>
          <SearchGroup
            onClickPrepend={this.props.onCancel}
            groupClass="flex-no-wrap"
            prepend={
              <i className="fa fa-times-circle" />
            }
            input={this.getInput()}
          />
        </FixedContainerOverMap>
        <div
          className="row no-gutters"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <BaseMap
            bounds={this.props.bounds}
            onclick={this.onClick}
            onmousemove={this.onMouseMove}
            ondragstart={this.onDragStart}
            ondragend={this.onDragEnd}
            ondrag={this.onDrag}
          >
            <BestTileLayer />
            {this.props.children}
            {this.getCurrent()}
            {this.getPending()}
          </BaseMap>
        </div>
      </div>
    );
  }

}

export default BoundsTracer;
