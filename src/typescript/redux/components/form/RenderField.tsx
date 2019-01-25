import * as React from 'react';
import classNames = require('classnames');
import { WrappedFieldProps } from 'redux-form';

/**
 * Climbing App field specific props
 */
interface AppProps {
  label: string;
  id?: string;
  help?: React.ReactNode;
  className?: string;
  // Input Component to use
  inputComponent: 'input' | 'textarea' | 'select';
}

/**
 * Helper to get unique input ids for `for`
 */
let id = 0;
function nextId() {
  id += 1;
  return `input-${id}`;
}

/**
 * Custom form field rendering
 * All fields will have:
 *   * A label
 *   * An input
 *   * A possible error slot
 *   * A possible help slot
 */
const RenderField: React.SFC<WrappedFieldProps & AppProps> = (props) => {
  const { input, meta, label, inputComponent, help, ...rest } = props;
  const id = props.id || nextId();
  return (
    <div className="form-group">
      <label htmlFor={id}>{props.label}</label>
      <div>
        {React.createElement(inputComponent, {
          placeholder: label,
          ...input,
          ...rest,
          className: classNames('form-control', { 'is-invalid': meta.touched && meta.error }, props.className),
          id
        })}
        {help && (
          <small className="form-text text-muted">
            {help}
          </small>
        )}
        {meta.touched && meta.error && (
          <div className="invalid-feedback">
            {meta.error}
          </div>
        )}
      </div>
    </div>
  );
};

RenderField.defaultProps = {
  inputComponent: 'input'
}

const fxn = (data) => {
  return <RenderField {...data} />;
}
export { fxn }
export default RenderField;
