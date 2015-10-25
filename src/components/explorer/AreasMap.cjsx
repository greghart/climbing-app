React = require 'react'
{PropTypes} = React
LayerContainer = require '../leaflet/LayerContainer'
AreaMap = require './AreaMap'

AreasMap = React.createClass

  propTypes: LayerContainer.outputTypes

  render: ->
    <div>
      {@props.areas.map (area) =>
        <AreaMap
          layerContainer={@props.layerContainer}
          key={area.id}
          area={area}
          selected={@props.selectedName is area.name}
          onClick={@props.onAreaClick}
        />
      }
    </div>

module.exports = AreasMap