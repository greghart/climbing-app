import * as React from 'react';
import classNames from 'classnames';

interface Props {
  groupClass?: string;
  buttonClass?: string;
  onClickPrepend?: React.MouseEventHandler<any>;
  onClickAppend?: React.MouseEventHandler<any>;
  prepend: React.ReactNode;
  input: React.ReactNode;
  append?: React.ReactNode;
}
/**
 * Our searcher is always part of a basic group
 */
const SearchGroup: React.SFC<Props> = (props) => {
  return (
    <div className={classNames(props.groupClass, 'input-group')}>
      <div className="input-group-prepend">
        <button
          className={classNames(
            'btn',
            props.buttonClass || 'btn-light',
          )}
          type="button"
          onClick={props.onClickPrepend}
        >
          {props.prepend}
        </button>
      </div>
      {props.input}
      {props.append && (
        <div className="input-group-append">
          <button
            className={classNames(
              'btn',
              props.buttonClass || 'btn-light',
            )}
            type="button"
            onClick={props.onClickAppend}
          >
            {props.prepend}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchGroup;
