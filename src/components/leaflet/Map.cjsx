React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'
listenForEvents = require './listenForEvents'

# Encapsulates Leaflet.Map
Map = React.createClass

  propTypes:
    # Option to pass to L.Map
    leafletOptions: PropTypes.object
    # Options to pass to container <div>
    containerOptions: PropTypes.object

  getInitialState: ->
    # Leaflet map instance
    map: null

  componentWillReceiveProps: ->
    # TODO Add smart calls based on prop changes without remounting map

  componentDidMount: ->
    @resetMap()

  resetMap: ->
    @state.map?.remove()
    map = L.map(
      @refs.mapContainer.getDOMNode(),
      @props.leafletOptions
    )
    listenForEvents map, @props
    @setState map: map

  componentWillUnmount: ->
    @state.map?.remove()

  getMap: ->
    @state.map

  render: ->
    <div ref='mapContainer' {...@props.containerOptions}>
      {
        if @state.map?
          <LayerContainer layerContainer={@state.map}>
            {@props.children}
          </LayerContainer>
        else
          <span>Loading...</span>
      }
    </div>

module.exports = Map