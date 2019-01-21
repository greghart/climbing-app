import * as React from 'react';
import isFunction = require('lodash/isFunction');

/**
 * A "Renderer" is something that takes args and renders a react node
 * Often, we want properties that will take either a renderer, or a pre-made node.
 * A "normalized" renderer will accept either and return a renderer
 */
type Renderer<P> = (input: P) => React.ReactNode;
type Renderable<P> = React.ReactNode | Renderer<P>;

function isRenderer<P>(renderer: React.ReactNode | Renderer<P>): renderer is Renderer<P> {
  return isFunction(renderer);
}

function normalizeRenderer<P>(potential: React.ReactNode | Renderer<P>): Renderer<P> {
  if (isRenderer(potential)) {
    return potential;
  }
  return (input: P) => {
    return potential;
  }
}

export { Renderable, Renderer };
export default normalizeRenderer;
