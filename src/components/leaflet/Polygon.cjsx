React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'

# Encapsulates Leaflet.Polygon
Polygon = React.createClass

  propTypes: Object.assign {}, LayerContainer.outputTypes
    # L.Polygon options
    # @see {http://leafletjs.com/reference.html#polygon}

  getInitialState: ->
    # Leaflet polygon instance
    polygon: null

  componentDidMount: ->
    return if @state.polygon?
    polygon = new L.Polygon(
      @props.coordinates,
      @props.style
    )
    polygon.on 'click', @props.onClick
    polygon.on 'mouseover', @props.onMouseOver
    polygon.on 'mouseout', @props.onMouseOut
    @props.layerContainer.addLayer(polygon)
    @setState polygon: polygon

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.polygon)

  getPolygon: ->
    @state.polygon

  render: ->
    <span/>

module.exports = Polygon
