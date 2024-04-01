/**
 * Some functional components for manipulating a graph
 */
import * as Leaflet from "leaflet";
import without from "lodash/without";
import values from "lodash/values";

type Node = Leaflet.LatLngLiteral;

// Generic interface
interface GraphInterface<Graph, Key = number> {
  // Initialize a graph
  initialize(): Graph;
  getNode(graph: Graph, k: Key): Node;
  getNodes(graph: Graph): Node[];
  getNodeKeys(graph: Graph): Key[];
  // Get outgoing edges for a node
  getEdges(graph: Graph, k: Key): Key[];
  // Add a node and return key to the new node
  addNode(graph: Graph, node: Node, key?: Key): Key;
  // Add an edge to the graph
  addEdge(graph: Graph, i: Key, j: Key): void;
  removeNode(graph: Graph, k: Key);
  removeEdge(graph: Graph, i: Key, j: Key);
}

type AdjacencyMap = { [index: number]: number[] };
interface AdjacencyGraph {
  nodes: { [key: number]: Node };
  _counter: number;
  adjacency: AdjacencyMap;
}
const adjacencyGraph: GraphInterface<AdjacencyGraph> = {
  initialize: () => {
    return {
      nodes: {},
      adjacency: {},
      _counter: 0,
    };
  },

  getNode: (graph, k) => {
    return graph.nodes[k];
  },

  getNodes: (graph) => {
    return values(graph.nodes);
  },

  getNodeKeys: (graph) => {
    return Object.keys(graph.nodes).map((i) => parseInt(i, 10));
  },

  getEdges: (graph, k) => {
    return graph.adjacency[k] || [];
  },

  addNode: (graph, node, _key?: number) => {
    const key = !!_key ? _key : graph._counter;
    // If we get server ids, make sure there's no collision
    // TODO Make a more universal use client id system
    if (key > graph._counter) {
      graph._counter = key;
    }
    graph._counter += 1;
    graph.nodes[key] = node;
    return key;
  },

  removeNode: (graph, k) => {
    // Remove node and all edges
    delete graph.nodes[k];
    delete graph.adjacency[k];
    Object.keys(graph.adjacency).forEach((thisI) => {
      graph.adjacency[thisI] = without(graph.adjacency[thisI], k);
    });
  },

  removeEdge: (graph, _i, _j) => {
    const i = _i > _j ? _j : _i;
    const j = _i > _j ? _i : _j;
    graph.adjacency[i] = without(graph.adjacency[i], j);
  },

  addEdge: (graph, i, j) => {
    // Special case, don't node to itself
    if (i === j) {
      return graph;
    }
    // We ensure one way paths by only storing edges as the lower index
    // Base node index
    const base = i > j ? j : i;
    const target = i > j ? i : j;

    // Setup adjacency and add (if not already)
    const existingAdjacency = graph.adjacency[base] || [];
    const newAdjacency =
      existingAdjacency.indexOf(target) === -1
        ? existingAdjacency.concat([target])
        : existingAdjacency;
    graph.adjacency = {
      ...graph.adjacency,
      [base]: newAdjacency,
    };
    return graph;
  },
};

export type { Node, GraphInterface };
export { adjacencyGraph };
export type { AdjacencyMap, AdjacencyGraph };
