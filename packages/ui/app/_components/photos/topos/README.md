# Topos 

Note that topos are done on the html canvas, and then exported to SVG for use within the flutter app.

The canvas is obviously incompatible with anything server, and so we must use the dynamic import touchpoints.
However, konva also requires non dynamic children components, so we leave only the top level `TopoCanvas` dynamic,
and everything else normal.