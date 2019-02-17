import * as React from 'react';
import 'rc-slider/assets/index.css';
import { WrappedFieldProps } from 'redux-form';
import * as Slider from 'rc-slider/lib/Slider';

interface Props {
  label: string;
}

/**
 * Redux-form integration for a slider
 *
 * Sends values 0-100 up
 */
const SliderField: React.ComponentType<WrappedFieldProps & Props> = (props) => {
  const { input, meta, label, ...rest } = props;
  console.warn({
    props,
    Slider
  }, 'SliderField');
  return (
    <div className="form-group">
      {props.label &&
        <label>{props.label}</label>
      }
      <div>
        <Slider
          {...input}
          {...rest}
        />
        {meta.touched && meta.error && (
          <div className="invalid-feedback">
            {meta.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderField;
