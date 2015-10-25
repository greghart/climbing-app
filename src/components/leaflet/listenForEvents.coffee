# Function to listen for events and trigger callbacks
#
# Handles transform between Leaflet and React style events
eventToCallback = {
  'click': 'onClick'
  'mouseover': 'onMouseOver'
  'mouseout': 'onMouseOut'
  'mouseover': 'onMouseOver'
  'mouseout': 'onMouseOut'
  'mousemove': 'onMouseMove'
}

listenForEvents = (leaflet, props) ->
  leaflet.on
  for event, callback of eventToCallback
    # Only attach to callbacks we actually have
    return unless props[eventToCallback[event]]?
    console.log "Adding event listener for #{event}"
    leaflet.on event, props[callback]

module.exports = listenForEvents