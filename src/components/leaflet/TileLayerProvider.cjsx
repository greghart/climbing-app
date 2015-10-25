React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'

# Encapsulates Leaflet.TileLayer.Provider plugin
# @see {https://github.com/leaflet-extras/leaflet-providers}
TileLayerProvider = React.createClass

  propTypes: Object.assign {}, LayerContainer.outputTypes,
    variant: PropTypes.string

  getInitialState: ->
    # Leaflet layer instance
    layer: null

  componentDidMount: ->
    return if @state.layer?
    layer = L.tileLayer.provider(@props.variant)
    @props.layerContainer.addLayer(layer)
    @setState layer: layer

  componentWillUnmount: ->
    @props.layerContainer.removeLayer(@state.layer)

  getTileLayer: ->
    @state.layer

  render: ->
    <span/>

module.exports = TileLayerProvider
