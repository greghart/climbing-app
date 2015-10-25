React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'
omit = require 'lodash/object/omit'
assign = require 'lodash/object/assign'

# Encapsulates Leaflet.Marker
Marker = React.createClass

  propTypes: Object.assign {}, LayerContainer.outputTypes,
    # L.Marker options
    coordinates: PropTypes.oneOf(
      PropTypes.shape({
        lat: PropTypes.number.isRequired
        lng: PropTypes.number.isRequired
      })
    )
    # Market takes Icon component as only child
    children: PropTypes.array
    # @see {http://leafletjs.com/reference.html#marker}

  getInitialState: ->
    # Leaflet marker instance
    marker: null

  componentDidMount: ->
    return if @state.marker?
    console.log @props.coordinates
    marker = new L.Marker(
      @props.coordinates,
      assign(
        omit(@props, 'coordinates', 'layerContainer'),
        icon: @refs.icon.getIcon()
      )
    )
    # TODO Handle all events automatically?
    marker.on 'click', @props.onClick
    marker.on 'mouseover', @props.onMouseOver
    marker.on 'mouseout', @props.onMouseOut
    @props.layerContainer.addLayer(marker)
    @setState marker: marker

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.marker)

  getMarker: ->
    @state.marker

  render: ->
    React.cloneElement(
      React.Children.only(@props.children),
      ref: 'icon'
    )

module.exports = Marker