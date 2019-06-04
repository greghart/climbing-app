import * as React from 'react';
import classNames from 'classnames';
import { WrappedFieldProps, Field, BaseFieldProps, GenericFieldHTMLAttributes } from 'redux-form';
import omit from 'lodash/omit';

/**
 * Climbing App field specific props
 */
interface AppProps {
  label?: string;
  placeholder?: string;
  id?: string;
  help?: React.ReactNode;
  className?: string;
  // Input Component to use
  inputComponent?: 'input' | 'textarea' | 'select';
  type?: string;
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
 * Render the input itself
 */
const RenderInput: React.ComponentType<WrappedFieldProps & AppProps> = (props) => {
  const { input, meta, label, inputComponent, help, ...rest } = props;
  return (
    React.createElement(inputComponent, {
      id,
      placeholder: props.placeholder || label,
      ...input,
      ...rest,
      className: classNames(
        {
          'is-invalid': meta.touched && meta.error ,
          'form-check-input': rest.type === 'checkbox',
          'form-control': rest.type !== 'checkbox'
        },
        props.className
      ),
    })
  );
};
/**
 * Custom form field rendering
 * All fields will have:
 *   * A label
 *   * An input
 *   * A possible error slot
 *   * A possible help slot
 */
const RenderField: React.ComponentType<WrappedFieldProps & AppProps> = (props) => {
  const { input, meta, label, inputComponent, help, ...rest } = props;
  const id = props.id || nextId();
  // Some slight rendering differences for checkboxes, but otherwise pretty standard.
  return (
    <div className={classNames({
      'form-check': rest.type === 'checkbox',
      'form-group': rest.type !== 'checkbox'
    })}>
      {rest.type !== 'checkbox' && props.label &&
        <label htmlFor={id}>{props.label}</label>
      }
      <RenderInput {...props} id={id} />
      {rest.type === 'checkbox' && props.label &&
        <label htmlFor={id}>{props.label}</label>
      }
      <div>
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
  inputComponent: 'input',
};

type FieldType = React.ComponentType<GenericFieldHTMLAttributes | BaseFieldProps | AppProps>;
const MyField: FieldType = (props) => {
  return (
    <Field<GenericFieldHTMLAttributes | BaseFieldProps | AppProps>
      component={RenderField}
      {...omit(props, 'component')}
    />
  );
};

export default MyField;
