React = require 'react'
{PropTypes} = React
transformCoordinates = require './transformCoordinates'
LayerContainer = require '../leaflet/LayerContainer'
Marker = require '../leaflet/Marker'
DivIcon = require '../leaflet/DivIcon'
Polygon = require '../leaflet/Polygon'

AreaMap = React.createClass

  propTypes:
    selected: PropTypes.bool

  normalStyle:
    weight: 1.0
    opacity: 1
    color: 'white'
    dashArray: 3
    fillOpacity: 0.2
    fillColor: '#088da5'
  overStyle:
    weight: 5
    color: '#666'
    dashArray: ''
    fillOpacity: 0.2

  onClick: ->
    @props.onClick?(@props.area)

  setStyle: (style) ->
    @refs.polygon.getPolygon().setStyle style
    unless L.Browser.ie or L.Browser.opera
      @refs.polygon.getPolygon().bringToFront()

  onMouseOver: ->
    @props.onMouseOver?(arguments...)
    @setStyle @overStyle

  onMouseOut: ->
    @props.onMouseOut?(arguments...)
    @setStyle @normalStyle

  getPolygon: ->
    return <span/> unless @props.area.coordinates?
    <Polygon
      ref='polygon'
      layerContainer={@props.layerContainer}
      coordinates={transformCoordinates(@props.area.coordinates)}
      style={@normalStyle}
      onClick={@onClick}
      onMouseOver={@onMouseOver}
      onMouseOut={@onMouseOut}
    />

  getBoulders: ->
    <span>
      {for thisBoulder in @props.area.boulders ? []
        <Marker
          layerContainer={@props.layerContainer}
          coordinates={thisBoulder.coordinates}
          icon={new L.divIcon(
            html: '*'
            className: "null"
          )}
        >
          <DivIcon
            className='null'
          >
            <span>
              <img
                src="http://33.media.tumblr.com/avatar_ed8e84defa40_128.png"
                style={
                  width: 12
                  height: 12
                }
              />
            </span>
          </DivIcon>
        </Marker>
      }
    </span>

  render: ->
    <span>
      {@getPolygon()}
      {if @props.selected then @getBoulders()}
    </span>

module.exports = AreaMap