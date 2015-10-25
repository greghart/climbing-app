React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'
listenForEvents = require './listenForEvents'

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
      @props.options
    )
    listenForEvents(polygon, @props)
    @props.layerContainer.addLayer(polygon)
    @setState polygon: polygon

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.polygon)

  getPolygon: ->
    @state.polygon

  render: ->
    <span/>

module.exports = Polygon
