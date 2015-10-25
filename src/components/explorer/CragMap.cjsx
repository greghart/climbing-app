# COmponent for a map of a crag
React = require 'react'
{PropTypes} = React
_ = require 'lodash'
transformCoordinates = require './transformCoordinates'
TileLayer = require '../leaflet/TileLayer'
Map = require '../leaflet/Map'
BestTileLayer = require '../BestTileLayer'
AreasMap = require './AreasMap'

CragMap = React.createClass

  propTypes:
    selectedName: PropTypes.string
    onAreaClick: PropTypes.func

  getMap: ->
    @refs.map

  componentWillReceiveProps: (nextProps) ->
    if @props.selectedName isnt nextProps.selectedName
      @refs.map.getMap().fitBounds transformCoordinates(
        _.findWhere(
          nextProps.areas,
          name: nextProps.selectedName
        ).coordinates
      )

  render: ->
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
      <BestTileLayer/>
      <AreasMap
        areas={@props.areas}
        selectedName={@props.selectedName}
        onAreaClick={@props.onAreaClick}
      />
    </Map>

module.exports = CragMap