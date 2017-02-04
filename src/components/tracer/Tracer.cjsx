# Top level view for Tracer component
#
# Tracer allows user to click points on a map and save them
# Implemented as a layer which will need to be put in a LayerContainer
React = require 'react'
{PropTypes} = React
LayerContainer = require '../leaflet/LayerContainer'
Map = require '../leaflet/Map'
BestTileLayer = require '../BestTileLayer'
Polyline = require '../leaflet/Polyline'
Polygon = require '../leaflet/Polygon'

Tracer = React.createClass

  getInitialState: ->
    points: []
    built: []
    current: null

  onClick: (e) ->
    # If it's a "finishing" point, close the polyline and set it as a polygon
    if @state.points.length > 2 and e.latlng.distanceTo(@state.points[0]) < 1
      @setState
        points: []
        built: @state.built.concat([@state.points])
    else
      @setState points: @state.points.concat([e.latlng])

  onMouseMove: (e) ->
    @setState current: e.latlng

  onSubmit: ->
    console.log 'submit'
    # TODO Callback with the list of built polygons
    # Some parent component should build client-side boulders into stores
    # We then go to an "Edit Pending Boulders" mode, which is just a boulder
    # form with a "Save + Next"

  handleControlKeys: (e) ->
    e.persist()
    console.log {
      e
    }, 'handleControlKeys'
    if e.key is 'z'
      @undo()

  undo: ->
    if @state.points.length > 0
      @setState points: @state.points[0...-1]

  getPoints: ->
    # Polyline of all existing points, plus one to cursor
    # We keep them separate for efficiency (base doesn't have to re-render )
    <LayerContainer {...@props}>
      <Polyline
        coordinates={@state.points}
        options={
          color: 'red'
        }
      />
      {if @state.current? and @state.points[@state.points.length-1]?
        <Polyline
          coordinates={[
            @state.points[@state.points.length-1]
            @state.current
          ]}
        />
      }
      {for thisBuilt, i in @state.built
        <Polygon
          key={i}
          coordinates={thisBuilt}
          options={
            color: 'green'
          }
        />
      }
    </LayerContainer>

  render: ->
    <div
      onKeyPress={@handleControlKeys}
    >
      <h2>Tracer</h2>
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
              center: [32.85052, -117.02223]
              zoom: 18
              minZoom: 15
              maxZoom: 22
            }
            onClick={@onClick}
            onMouseMove={@onMouseMove}
            {# Needed to get move events }
            onMouseOut={->}
            onMouseOver={->}
          >
            <BestTileLayer/>
            {@getPoints()}
          </Map>
        </div>
        <div className='col-md-2'>
          <button
            className='btn btn-success'
            onClick={@onSubmit}
          >
            Submit
          </button>
          <hr/>
          <div className='row'>
            <div className='col-md-12'>
              {# Controls }
              <button
                className='btn'
                onClick={@undo}
              >
               <-
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

module.exports = Tracer