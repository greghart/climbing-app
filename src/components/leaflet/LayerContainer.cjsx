# Both Leaflet.Map and Leaflet.LayerGroup support #addLayer and #removeLayer
# This component sets up a standard API, since components shouldn't care
# which they are under
React = require 'react'
{PropTypes} = React

LayerContainer = React.createClass

  render: ->
    <span>
      {React.Children.map @props.children, (child) =>
        React.cloneElement child,
          layerContainer: @props.layer
      }
    </span>

LayerContainer.outputTypes =
  layerContainer: PropTypes.object.isRequired

module.exports = LayerContainer