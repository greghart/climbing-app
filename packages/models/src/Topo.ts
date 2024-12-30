/**
 * A Topo represents drawn diagrams on top of photo, intending
 * to show route lines, sections of a wall, or a topo of a crag 
 * showing areas from afar.
 * 
 * Features:
 *  * Vector based canvas editor to generate topos
 *  * A Topo can be associated with any Photoable, and also have
 *    additional relationships with crags, areas, boulders, or routes.
 *    * Crag -- topos annotate areas in the crag
 *    * Area -- topos annotate boulders in an area
 *    * Boulder -- topos annotate the routes on a boulder.
 *    * Route -- topo annotates a single route on a single image.
 *  * A Topo will have various tools for generating diagrams
 *    * Path -- basic paths, or even a closed polygon
 *    * Icons -- signal hold types, or mark flexing holds, etc.
 *    * Labels -- while associations will help us relate which path applies to what,
 *      labels can bake that into the image.
 */