React = require 'react'
{PropTypes} = React
classNames = require 'classnames'
_ = require 'lodash'

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

module.exports = AreasList