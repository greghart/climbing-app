import * as React from "react";
import type { WrappedFieldProps } from "redux-form";

const adaptFileEventToValue = (delegate) => (e) => delegate(e.target.files[0]);

const FileInput: React.ComponentType<WrappedFieldProps> = (props) => {
  const {
    input: { value: omitValue, onChange, onBlur, ...inputProps },
    meta: omitMeta,
    ...rest
  } = props;
  return (
    <React.Fragment>
      {props.meta.error && (
        <div className="invalid-feedback">{props.meta.error}</div>
      )}
      <input
        onChange={adaptFileEventToValue(onChange)}
        onBlur={adaptFileEventToValue(onBlur)}
        type="file"
        {...inputProps}
        {...rest}
      />
    </React.Fragment>
  );
};

export default FileInput;
