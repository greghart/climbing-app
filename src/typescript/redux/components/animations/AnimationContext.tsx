import * as React from 'react';

/**
 * A context for current animation state.
 * 
 * Setup to support deeply nested custom animations
 */
const AnimationContext = React.createContext(
  { in: false } 
);

export default AnimationContext;
