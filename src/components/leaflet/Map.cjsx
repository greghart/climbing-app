React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'

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
    @setState
      map: L.map(
        @refs.mapContainer.getDOMNode(),
        @props.leafletOptions
      )

  componentWillUnmount: ->
    @state.map?.remove()

  getMap: ->
    @state.map

  render: ->
    console.log 'Map.render'
    <div ref='mapContainer' {...@props.containerOptions}>
      {
        if @state.map?
          <LayerContainer layer={@state.map}>
            {@props.children}
          </LayerContainer>
        else
          <span>Loading...</span>
      }
    </div>

module.exports = Map