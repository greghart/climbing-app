/**
 * Some functional components for manipulating a graph
 */
import * as Leaflet from 'leaflet';

type Node = Leaflet.LatLngLiteral;

// Generic interface
interface GraphInterface<Graph, Key = number> {
  // Initialize a graph
  initialize(): Graph;
  getNode(graph: Graph, k: Key): Node;
  getNodes(graph: Graph): Node[];
  // Get outgoing edges for a node
  getEdges(graph: Graph, k: Key): Key[];
  // Add a node and return key to the new node
  addNode(graph: Graph, node: Node): Key;
  // Add an edge to the graph
  addEdge(graph: Graph, i: Key, j: Key): void;
}

type AdjacencyMap = { [index: number]: number[] };
interface AdjacencyGraph {
  nodes: Node[];
  adjacency: AdjacencyMap;
}
const adjacencyGraph: GraphInterface<AdjacencyGraph> = {
  initialize: () => {
    return {
      nodes: [],
      adjacency: {}
    };
  },

  getNode: (graph, k) => {
    return graph.nodes[k];
  },

  getNodes: (graph) => {
    return graph.nodes;
  },

  getEdges: (graph, k) => {
    return graph.adjacency[k] || [];
  },

  addNode: (graph, node) => {
    graph.nodes.push(node);
    return graph.nodes.length - 1;
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
    const newAdjacency = existingAdjacency.indexOf(target) === -1 ?
      existingAdjacency.concat([target]) :
      existingAdjacency;
    graph.adjacency = {
      ...graph.adjacency,
      [base]: newAdjacency
    };
    return graph;
  },
};

export { Node, GraphInterface };
export { adjacencyGraph, AdjacencyMap, AdjacencyGraph };
