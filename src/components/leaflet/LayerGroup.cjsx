React = require 'react'
{PropTypes} = React
LayerContainer = require './LayerContainer'

omit = require 'lodash/object/omit'

# Encapsulates Leaflet.LayerGroup
# Puts all children in a layer group that is added to map
LayerGroup = React.createClass

  propTypes: Map.outputTypes

  getInitialState: ->
    # Leaflet layer instance
    layer: null

  componentDidMount: ->
    return if @state.group?
    group = L.layerGroup()
    @props.map.addLayer(group)
    @setState group: group

  componentWillUnmount: ->
    @props.map.removeLayer(@state.group)

  getLayerGroup: ->
    @state.group

  render: ->
    <span style={display: 'none'}>
      {
        if @state.group?
          <LayerContainer layer={@state.group}>
            {@props.children}
          </LayerContainer>
        else
          <span>Loading...</span>
      }
    </span>

module.exports = LayerGroup