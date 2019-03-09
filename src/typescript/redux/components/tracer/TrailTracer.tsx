/**
 * Top level view for TrailTracer component
 *
 * TrailTracer allows user to click points on a map and save them
 */
import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, Polyline, Marker, CircleMarker } from 'react-leaflet';
import findIndex = require('lodash/findIndex');
import reduce = require('lodash/reduce');

import BestTileLayer from '../BestTileLayer';
import FixedContainerOverMap from '../layouts/FixedContainerOverMap';
import SearchGroup from '../search/SearchGroup';
import classNames = require('classnames');
import { ExtractProps } from '../../../externals';

const mapIcon = '<span><i class="fa fa-circle"/></span>';
const selectedIcon = Leaflet.divIcon({
  className: 'text-primary',
  html: mapIcon,
});
const normalIcon = Leaflet.divIcon({
  className: 'text-success',
  html: mapIcon,
});

// We store our trail graph with lat lng literals as nodes and an adjacency list
type Node = Leaflet.LatLngLiteral;
type AdjacencyMap = { [index: number]: number[] };

interface TrailTracerProps {
  title?: string;
  magnetSizeMeters?: number;
  bounds: Leaflet.LatLngBoundsExpression;
  onCancel: React.MouseEventHandler;
  onSubmit?: (nodes: Node[], adjacency: AdjacencyMap) => unknown;
}

type Mode = 'insert' | 'manipulate';
interface TrailTracerState {
  nodes: Node[];
  // Adjacency list. Uses array index of `nodes`
  adjacency: AdjacencyMap;
  // Currently selected node
  currentlySelected?: number;
  // Current mode of tracer.
  mode: 'insert' | 'manipulate';
  isDragging: boolean;
  // Current mouse position
  current: Leaflet.LatLng;
}

type DraggableMarkerProps = ExtractProps<typeof Marker> & {
  onUpdate?: (node: Node) => unknown;
  color?: string;
  radius?: number;
};
/**
 * A draggable marker that won't update while it's dragging.
 *
 * This allows us to re-render the parent container, but not interrupt Leaflet's drag
 * workflow.
 */
class DraggableMarker extends React.Component<DraggableMarkerProps, { isDragging: boolean }> {

  static defaultProps = {
    onUpdate: (node) => false,
    radius: 4
  };

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  onDragStart(e: Leaflet.LeafletMouseEvent) {
    // A drag click is not a click click
    this.setState({ isDragging: true });
  }

  onDragEnd(e: Leaflet.DragEndEvent) {
    this.props.onUpdate(e.target._latlng);
    this.setState({ isDragging: false });
  }

  onDrag(e: Leaflet.DragEndEvent) {
    // const point = this.state.nodes[nodeIndex];
    // point.lat = e.target._latlng.lat;
    // point.lng = e.target._latlng.lng;
    // this.forceUpdate();
    console.log(e, 'drag');
    this.props.onUpdate(e.target._latlng);
  }

  shouldComponentUpdate() {
    return !this.state.isDragging;
  }

  render() {
    return (
      <Marker
        icon={selectedIcon}
        {...this.props}
        ondragstart={this.onDragStart}
        ondragend={this.onDragEnd}
        ondrag={this.onDrag}
      />
    );
  }
}

/**
 * A trail tracer that functions very similarly to a pen tool in photoshop.
 *
 * There are two modes: insert and manipulate.
 * During insert mode, clicks will _always_ add a new edge, and possibly a new node.
 * During manipulate mode, we just allow selecting what the current node is.
 *
 * @todo For simplicity, we will not support deleting straight off the bat, as this would
 *  allow non-connected graphs and we don't handle that yet.
 */
class TrailTracer extends React.Component<TrailTracerProps, TrailTracerState> {

  static defaultProps = {
    title: 'Trace',
    magnetSizeMeters: 4,
  };

  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      adjacency: {},
      currentlySelected: undefined,
      mode: 'insert',
      current: undefined,
      isDragging: false
    };
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  /**
   * Get the mode for a mouse event
   *
   * This is a function of an event, as modifier keys can change mode.
   * Or, we just make keypresses change component state, hmmm
   */
  getMode(e: Leaflet.LeafletMouseEvent): Mode {
    if (e.originalEvent.metaKey || e.originalEvent.ctrlKey) {
      return 'manipulate';
    }
    return this.state.mode;
  }

  onClick(e) {
    const mode = this.getMode(e);
    if (mode === 'insert') {
      this.onClickInsert(e);
    } else if (mode === 'manipulate') {
      this.onClickManipulate(e);
    }
  }

  onClickManipulate(e) {
    // Click an existing node
    const existingNodeIndex = findIndex(
      this.state.nodes,
      (thisNode) => e.latlng.distanceTo(thisNode) < this.props.magnetSizeMeters
    );
    if (existingNodeIndex !== -1) {
      this.setState({
        currentlySelected: existingNodeIndex
      });
    }
  }

  onClickInsert(e) {
    // First node is special, nothing to do
    if (this.state.nodes.length === 0) {
      this.setState({
        nodes: [e.latlng],
        currentlySelected: 0
      });
      return;
    }

    // Target node index
    let targetNodeIndex;
    // New nodes
    let newNodes;

    // If it's an existing point, just add a new edge
    const existingNodeIndex = findIndex(
      this.state.nodes,
      (thisNode) => e.latlng.distanceTo(thisNode) < this.props.magnetSizeMeters
    );
    // If it's an existing node, just add a new edge
    if (existingNodeIndex !== -1) {
      targetNodeIndex = existingNodeIndex;
      newNodes = this.state.nodes;
    // Otherwise, add a new vertex and a new edge
    } else {
      newNodes = this.state.nodes.concat([e.latlng]);
      targetNodeIndex = newNodes.length - 1;
    }

    // Special case, don't allow clicking currently selected
    if (this.state.currentlySelected === targetNodeIndex) {
      return;
    }
    // We ensure one way paths by only storing edges as the lower index
    // Base node index
    let baseNodeIndex = this.state.currentlySelected;
    // Regardless, we always "select" the next one
    const nextSelected = targetNodeIndex;
    if (this.state.currentlySelected > targetNodeIndex) {
      baseNodeIndex = targetNodeIndex;
      targetNodeIndex = this.state.currentlySelected;
    }

    // Setup new adjacency if it doesn't already exist
    const existingAdjacency = this.state.adjacency[baseNodeIndex] || [];
    const newAdjacency = existingAdjacency.indexOf(targetNodeIndex) === -1 ?
      existingAdjacency.concat([targetNodeIndex]) :
      existingAdjacency;
    this.setState({
      adjacency: {
        ...this.state.adjacency,
        [baseNodeIndex]: newAdjacency
      },
      nodes: newNodes,
      currentlySelected: nextSelected
    });
    return;
    // if (
    //   this.state.points.length > 2 &&
    //   e.latlng.distanceTo(this.state.points[0]) < this.props.magnetSizeMeters
    // ) {
    //   const newPoints = this.state.points.concat([this.state.points[0]]);
    //   this.setState({
    //     points: newPoints,
    //     isDone: true,
    //   });
    //   if (this.props.onTrailComplete) {
    //     this.props.onTrailComplete(newPoints);
    //   }
    // } else {
    //   this.setState({
    //     points: this.state.points.concat([e.latlng]),
    //   });
    // }
  }

  onMouseMove(e: Leaflet.LeafletMouseEvent) {
    if (this.getMode(e) === 'manipulate') {
    } else {
      this.setState({ current: e.latlng });
    }
  }

  onKeyPress(e: React.KeyboardEvent<any>) {
    if (e.key === ' ') {
      this.setState({
        mode: this.state.mode === 'insert' ? 'manipulate' : 'insert'
      });
    }
  }

  undo() {
    // if (this.state.points.length > 0) {
    //   this.setState({
    //     points: this.state.points.slice(0, -1),
    //     isDone: false,
    //   });
    // }
  }

  getPoints() {
    // Polyline of all existing edges, plus one to cursor
    return [
      ...reduce(
        this.state.nodes,
        (memo, thisNode, index) => {
          return memo
          // Add edges
          .concat((this.state.adjacency[index] || []).map((targetNodeIndex) => (
            <Polyline
              key={`line-${index}-${targetNodeIndex}`}
              positions={[
                thisNode,
                this.state.nodes[targetNodeIndex]
              ]}
              color="red"
            />
          )));
        },
        []
      ),
      (
        (
          this.state.mode === 'insert' &&
          this.state.current &&
          this.state.currentlySelected !== undefined
        ) &&
        <Polyline
          key="current-line-pending"
          positions={[
            this.state.nodes[this.state.currentlySelected],
            this.state.current,
          ]}
        />
      ),
      // Add non selected node markers
      ...this.state.nodes.map((thisNode, index) => (
        <DraggableMarker
          key={`marker-${index}`}
          icon={index === this.state.currentlySelected ? selectedIcon : normalIcon}
          position={thisNode}
          color={index === this.state.currentlySelected ? 'green' : 'red'}
          draggable={this.state.mode === 'manipulate'}
          onUpdate={(latlng) => {
            const point = this.state.nodes[index];
            point.lat = latlng.lat;
            point.lng = latlng.lng;
            this.forceUpdate();
          }}
          onclick={(e) => {
            e.originalEvent.preventDefault();
            this.setState({
              currentlySelected: index
            });
          }}
        />
      ))
    ];
  }

  getInput() {
    return (
      <div className="input-group-append flex-grow-up bg-light align-items-center text-center">
        <div className="col">
          {this.props.title}
        </div>
        <div className="col-auto">
          <a
            role="button"
            className="btn btn-link"
            onClick={() => (
              this.props.onSubmit &&
              this.props.onSubmit(this.state.nodes, this.state.adjacency)
            )}
          >
            <i className="fa fa-check pull-right"/>
          </a>
        </div>
      </div>
    );
  }

  /**
   * Get the mode controls for the tracer
   */
  getControls() {
    return (
      <div className="row">
        <div className="col-auto">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label
              className={classNames(
                'btn btn-secondary',
                { active: this.state.mode === 'insert' }
              )}
            >
              <input
                type="radio"
                name="options"
                autoComplete="off"
                checked={this.state.mode === 'insert'}
                onChange={(e) => this.setState({ mode: 'insert' })}
              /> Insert
            </label>
            <label
              className={classNames(
                'btn btn-secondary',
                { active: this.state.mode === 'manipulate' }
              )}
            >
              <input
                type="radio"
                name="options"
                autoComplete="off"
                defaultChecked={this.state.mode === 'manipulate'}
                onChange={(e) => this.setState({ mode: 'manipulate' })}
              /> Select
            </label>
          </div>
        </div>
        <div className="col-12 col-sm-auto text-left">
          <p className="text-info small">
            Hit Space to toggle "Select" mode (or press on mobile).
            This allows you to select your base node to start a new trail branch,
            or move existing nodes.
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      /** Fill up whatever space is given to the tracer */
      <div
        className="w-100 h-100"
        onKeyPress={this.onKeyPress}
      >
        <FixedContainerOverMap>
          <SearchGroup
            onClickPrepend={this.props.onCancel}
            groupClass="flex-no-wrap"
            prepend={
              <i className="fa fa-times-circle" />
            }
            input={this.getInput()}
          />
          <div className="card bg-light">
            <div className="card-body p-2">
              {this.getControls()}
            </div>
          </div>
        </FixedContainerOverMap>
        <div
          className="row no-gutters"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Map
            style={{
              width: '100%',
              height: '100%',
            }}
            bounds={this.props.bounds}
            zoom={18}
            minZoom={15}
            maxZoom={22}
            zoomControl={false}
            onclick={this.onClick}
            // onmousemove={this.onMouseMove}
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

export default TrailTracer;
