# Component that is the best TileLayer for general purposes
React = require 'react'
{PropTypes} = React
TileLayer = require './leaflet/TileLayer'

BestTileLayer = React.createClass

  render: ->
    <TileLayer
      {...@props}
      url='//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      maxZoom={22}
      maxNativeZoom={18}
    />

module.exports = BestTileLayer