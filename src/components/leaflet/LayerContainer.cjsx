# Both Leaflet.Map and Leaflet.LayerGroup support #addLayer and #removeLayer
# This component sets up a standard API, since components shouldn't care
# which they are under.
# Also nestable, to pass layer through other markup
React = require 'react'
{PropTypes} = React

LayerContainer = React.createClass

  render: ->
    <span>
      {React.Children.map @props.children, (child) =>
        return unless child?
        React.cloneElement child,
          layerContainer: @props.layerContainer
      }
    </span>

LayerContainer.outputTypes =
  layerContainer: PropTypes.object.isRequired

module.exports = LayerContainer