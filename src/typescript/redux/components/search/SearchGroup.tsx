import * as React from 'react';
import { props } from 'bluebird';
import classNames = require('classnames');

interface Props {
  groupClass?: string;
  buttonClass?: string;
  onClickPrepend: React.MouseEventHandler<any>;
  prepend: React.ReactNode;
  input: React.ReactNode;
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
            props.buttonClass || 'btn-light'
          )}
          type="button"
          onClick={props.onClickPrepend}
        >
          {props.prepend}
        </button>
      </div>
      {props.input}
    </div>
  );
};

export default SearchGroup;
