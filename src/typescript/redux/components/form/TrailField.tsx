import * as React from 'react';
import * as Leaflet from 'leaflet';
import { WrappedFieldsProps } from 'redux-form';
import get = require('lodash/get');
import reduce = require('lodash/reduce');

import TrailTracer from '../tracer/TrailTracer';
import BaseMap from '../map/BaseMap';
import { ExtractProps } from '../../../externals';
import { AdjacencyGraph, adjacencyGraph } from '../util/graph';
import TrailNode from '../../../models/TrailNode';
import TrailEdge from '../../../models/TrailEdge';
import { Polyline } from 'react-leaflet';

interface TrailProps {
  // We will use:
  //  [0] -- nodes
  //  [1] -- edges
  //  [2] -- updating flag
  names: [string, string, string];
  // Other layers to include on the map -- takes form level coords as an argument
  otherLayers?: () => React.ReactNode;
  bounds: Leaflet.LatLngBoundsExpression;
  // Additional props to tracer
  tracerProps?: Partial<ExtractProps<typeof TrailTracer>>;
}

type ClientEdge = {
  a: number;
  b: number;
};
function adaptRawToGraph(nodes: TrailNode[], edges: ClientEdge[]): AdjacencyGraph {
  const graph = adjacencyGraph.initialize();
  nodes.forEach((thisNode) => adjacencyGraph.addNode(graph, thisNode, parseInt(thisNode.id, 10)));
  edges.forEach((thisEdge) => adjacencyGraph.addEdge(graph, thisEdge.a, thisEdge.b));
  return graph;
}
function adaptGraphToRaw(graph: AdjacencyGraph) {
  return reduce(
    adjacencyGraph.getNodeKeys(graph),
    (memo, key) => {
      memo.nodes.push({
        id: key,
        ...adjacencyGraph.getNode(graph, key)
      });
      memo.edges = memo.edges.concat(
        adjacencyGraph.getEdges(graph, key).map((target) => {
          return {
            a: key,
            b: target
          };
        })
      );
      return memo;
    },
    { nodes: [], edges: [] }
  );
}

const TrailField: React.ComponentType<WrappedFieldsProps & TrailProps> = (props) => {
  const nodes = get(props, props.names[0]);
  const edges = get(props, props.names[1]);
  const isUpdating = get(props, props.names[2]);

  const graph = adaptRawToGraph(nodes.input.value || [], edges.input.value || []);
  if (!isUpdating.input.value) {
    return (
      <div>
        <div className="row">
          <div className="col">
            <BaseMap bounds={props.bounds} style={{ paddingBottom: '50%' }}>
              {...reduce(
                adjacencyGraph.getNodeKeys(graph),
                (memo, index) => {
                  const thisNode = adjacencyGraph.getNode(graph, index);
                  return memo.concat(
                    adjacencyGraph.getEdges(graph, index)
                    .map((targetNodeIndex) => (
                      <Polyline
                        positions={[
                          thisNode,
                          adjacencyGraph.getNode(graph, targetNodeIndex)
                        ]}
                        color="blue"
                      />
                    ))
                  );
                },
                []
              )}
            </BaseMap>
          </div>
        </div>
        <div className="btn btn-link" onClick={() => isUpdating.input.onChange(true)}>
          <small>
            Edit <i className="fa fa-edit ml-2"/>
          </small>
          {nodes.meta.touched && nodes.meta.error && (
            <div className="invalid-feedback">
              {nodes.meta.error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed-container fullscreen over-map bg-dark">
      <TrailTracer
        {...props.tracerProps}
        defaultGraph={graph}
        bounds={props.bounds}
        onCancel={() => isUpdating.input.onChange(false)}
        onSubmit={(graph) => {
          const raw = adaptGraphToRaw(graph);
          nodes.input.onChange(raw.nodes);
          edges.input.onChange(raw.edges);
          isUpdating.input.onChange(false);
          // const value = polygon.input.value || {};
          // value.coordinates = newCoordinates.map((thisC, i) => {
          //   return {
          //     ...thisC,
          //     order: i,
          //   };
          // });
          // polygon.input.onChange(value);
          // isUpdating.input.onChange(false);
        }}
      >
        {props.otherLayers && props.otherLayers()}
      </TrailTracer>
    </div>
  );
};

export { TrailProps as TrailFieldProps };
export default TrailField;
