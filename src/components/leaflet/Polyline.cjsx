React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'
listenForEvents = require './listenForEvents'

# Encapsulates Leaflet.Polyline
Polyline = React.createClass

  propTypes: Object.assign {}, LayerContainer.outputTypes
    # L.Polyline options
    # @see {http://leafletjs.com/reference.html#polyline}

  getInitialState: ->
    # Leaflet polyline instance
    polyline: null

  componentWillReceiveProps: (nextProps) ->
    return unless @state.polyline?
    @state.polyline.setLatLngs(
      nextProps.coordinates
    )

  componentDidMount: ->
    return if @state.polyline?
    polyline = new L.Polyline(
      @props.coordinates,
      @props.options
    )
    listenForEvents(polyline, @props)
    @props.layerContainer.addLayer(polyline)
    @setState polyline: polyline

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.polyline)

  getPolyline: ->
    @state.polyline

  render: ->
    <span/>

module.exports = Polyline
