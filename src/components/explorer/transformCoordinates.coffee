# Basic helper since we sometimes have coordinates in lon lat for some reason
transformCoordinates = (coordinates) ->
  if _.isArray(coordinates?[0])
    coordinates?.map( (c) ->
      [c[1], c[0]]
    )
  else if coordinates?
    [coordinates[1], coordinates[0]]
  else
    null

module.exports = transformCoordinates