React = require 'react/addons'
{PropTypes} = React
{
  Formal
  FormalField
  FormalInput
  FormalLabel
  FormalSelect
  FormalWrapper
} = require 'adc2-ui-formal'
classNames = require 'classnames'


Form = React.createClass

  render: ->
    <Formal
      ref="form"
      initialData={@props.boulder}
      initialError={@props.error?.getErrors()}
      onChange={@onChange}
      >

      <FormalField property='name'>
        <FormalLabel>Name</FormalLabel>
        <FormalInput/>
      </FormalField>

      <FormalField property='area'>
        <FormalLabel>Area</FormalLabel>
      </FormalField>
    </Formal>
  </div>

module.exports = Form