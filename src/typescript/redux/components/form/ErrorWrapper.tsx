import * as React from 'react';
import classNames = require('classnames');
import { WrappedFieldProps, Field, BaseFieldProps, GenericFieldHTMLAttributes } from 'redux-form';
import { ExtractProps } from '../../../externals';
import omit = require('lodash/omit');

interface AdditionalProps {
  renderBody?: (err: WrappedFieldProps) => React.ReactNode;
}

/**
 * Wrapper to just display a fields' error.
 *
 * This is useful for nested fields where the root key may throw an error, even
 * though our existing fields only handle the sub keys.
 * Ie. `parent.child1` vs `parent`, for `coordinate.lat`, vs `coordinate
 */
const ErrorWrapper: React.ComponentType<WrappedFieldProps & AdditionalProps> = (props) => {
  return (
    <React.Fragment>
      {props.meta.error && (
        <div className="invalid-feedback show">
          {props.renderBody(props)}
        </div>
      )}
    </React.Fragment>
  )
};

ErrorWrapper.defaultProps = {
  renderBody: (props) => (
    `${props.input.name} - ${props.meta.error}`
  )
}

export default ErrorWrapper;
