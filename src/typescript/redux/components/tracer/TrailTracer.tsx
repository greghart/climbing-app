/**
 * Top level view for TrailTracer component
 *
 * TrailTracer allows user to click points on a map and save them
 */
import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Map, Polyline, Circle, Marker } from 'react-leaflet';
import findIndex = require('lodash/findIndex');
import reduce = require('lodash/reduce');

import BestTileLayer from '../BestTileLayer';
import FixedContainerOverMap from '../layouts/FixedContainerOverMap';
import SearchGroup from '../search/SearchGroup';
import classNames = require('classnames');

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
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onDragSelectedStart = this.onDragSelectedStart.bind(this);
    this.onDragSelectedEnd = this.onDragSelectedEnd.bind(this);
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

  onKeyDown(e: React.KeyboardEvent<any>) {
    // Turn manipulate on ctrl key, and off on release
    if (e.key === ' ') {
      this.setState({
        mode: 'manipulate'
      });
    }
  }

  onKeyUp(e: React.KeyboardEvent<any>) {
    if (e.key === ' ') {
      this.setState({
        mode: 'insert'
      });
    }
  }

  onDragSelectedStart(e: React.MouseEvent) {
    console.log('onDragStart');
    console.log(e);
  }

  onDragSelectedEnd(e: React.MouseEvent) {
    console.log('onDragEnd');
    console.log(e);
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
      // Add node markers
      ...this.state.nodes.map((thisNode, index) => (
        <Marker
          key={`marker-${thisNode.lat}-${thisNode.lng}`}
          position={thisNode}
        >
          <Circle
            center={thisNode}
            radius={0.2}
            color={index === this.state.currentlySelected ? 'green' : 'red'}
          />
        </Marker>
      ))
    ];
  }

  getInput() {
    return (
      <div className="input-group-append flex-grow-up bg-light align-items-center text-center">
        <div className="col">
          {this.props.title} (TODO Instructions and mobile mode)
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
              /> Manipulate
            </label>
          </div>
        </div>
        <div className="col-12 col-sm-auto text-left">
          <p className="text-info small">
            Hold Space to go into "Manipulate" mode (or press on mobile). <br/>
            This allows you to select your current node and move it around.
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
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
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
