# Component to reflect a specific Crag (Tram, Santee, etc.)
React = require 'react'
{PropTypes} = React
Map = require './leaflet/Map'
TileLayer = require './leaflet/TileLayer'
LayerContainer = require './leaflet/LayerContainer'
Polygon = require './leaflet/Polygon'
DivIcon = require './leaflet/DivIcon'
Marker = require './leaflet/Marker'
areas = require './tramCragData'
_ = require 'lodash'
classNames = require 'classnames'

transformCoordinates = (coordinates) ->
  if _.isArray(coordinates?[0])
    coordinates?.map( (c) ->
      [c[1], c[0]]
    )
  else if coordinates?
    [coordinates[1], coordinates[0]]
  else
    null

MapArea = React.createClass

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

AreasMap = React.createClass

  propTypes: LayerContainer.outputTypes

  render: ->
    <div>
      {@props.areas.map (area) =>
        <MapArea
          layerContainer={@props.layerContainer}
          key={area.id}
          area={area}
          selected={@props.selectedName is area.name}
          onClick={@props.onAreaClick}
        />
      }
    </div>

AreasList = React.createClass

  render: ->
    <div>
      <ul>
      {for thisArea in @props.areas
        selected = @props.selectedName is thisArea.name
        <li
          className={classNames(
            "text-success":selected
          )}
          onClick={_.partial(@props.onAreaClick, thisArea)}
        >
          {thisArea.name}
          {if selected
            <ul>
              {for thisBoulder in thisArea.boulders
                <li>{thisBoulder.name}</li>
              }
            </ul>
          }
        </li>
      }
      </ul>
    </div>
Crag = React.createClass

  getDefaultProps: ->
    title: 'Tramway'

  getInitialState: ->
    # TODO Convert this to props and store in Store (or Route even)
    # Which area is selected (defaults to none)
    selectedName: null

  onAreaClick: (area) ->
    @refs.map.getMap().fitBounds transformCoordinates(area.coordinates)
    @setState selectedName: area.name

  render: ->
    <div>
      <h2>Crag {@props.title}</h2>
      <div className='row'>
        <div
          className='col-md-10'
          style={
            width: '80%'
            height: '80vh'
          }
          >
          <Map
            ref='map'
            containerOptions={
              style:
                width: '100%'
                height: '100%'
            }
            leafletOptions={
              center: [33.810942, -116.645494]
              zoom: 18
              minZoom: 15
              maxZoom: 22
            }
          >
            <TileLayer
              url='//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              maxZoom={22}
              maxNativeZoom={18}

            />
            <AreasMap
              areas={areas}
              selectedName={@state.selectedName}
              onAreaClick={@onAreaClick}
            />
          </Map>
        </div>
        <div className='col-md-2'>
          Areas
          <AreasList
            areas={areas}
            selectedName={@state.selectedName}
            onAreaClick={@onAreaClick}
          />
        </div>
      </div>
    </div>

module.exports = Crag