React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'

omit = require 'lodash/object/omit'

# Encapsulates Leaflet.TileLayer
TileLayer = React.createClass

  propTypes: Object.assign {}, LayerContainer.outputTypes,
    # L.TileLayer options
    # @see {http://leafletjs.com/reference.html#tilelayer}
    url: PropTypes.string.isRequired

  getInitialState: ->
    # Leaflet layer instance
    layer: null

  componentDidMount: ->
    return if @state.layer?
    layer = L.tileLayer(
      @props.url,
      omit(@props, 'url', Object.keys(LayerContainer.outputTypes))
    )
    @props.layerContainer.addLayer(layer)
    @setState layer: layer

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.layer)

  getTileLayer: ->
    @state.layer

  render: ->
    <span/>

module.exports = TileLayer