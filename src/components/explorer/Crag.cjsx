# Top level copmonent for Crag explorer
React = require 'react'
{PropTypes} = React
TileLayer = require '../leaflet/TileLayer'
CragMap = require './CragMap'
AreasList = require './AreasList'

# TODO Replace this with Stores
areas = require '../tramCragData'

Crag = React.createClass

  getDefaultProps: ->
    title: 'Tramway'

  getInitialState: ->
    # TODO Convert this to props and store in Store (or Route even)
    # Which area is selected (defaults to none)
    selectedName: null

  onAreaClick: (area) ->
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
          <CragMap
            areas={areas}
            selectedName={@state.selectedName}
            onAreaClick={@onAreaClick}
          />
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