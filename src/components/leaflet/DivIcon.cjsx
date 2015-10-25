React = require 'react'
{PropTypes} = React
omit = require 'lodash/object/omit'
assign = require 'lodash/object/assign'

# Encapsulates Leaflet.DivIcon
#
# @note This is a non mounted component -- completely transparent
# and just reflects a DivIcon class which is accessed via
# #getIcon
DivIcon = React.createClass

  propTypes:
    # L.DivIcon options
    # @see {http://leafletjs.com/reference.html#divicon}
    # Support for single child as html if div
    children: PropTypes.array

  ### ICON API ###
  getIcon: ->
    new L.DivIcon(
      assign(
        omit(@props, 'children', 'html'),
        html: React.findDOMNode(@refs.child).innerHTML
      )
    )

  render: ->
    React.cloneElement(
      React.Children.only(@props.children),
      ref: 'child'
    )

module.exports = DivIcon
