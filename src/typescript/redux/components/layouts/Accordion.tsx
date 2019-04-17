import * as React from 'react';
import isFunction from 'lodash/isFunction';

/**
 * A pure Accordion component
 *
 * Handles:
 *   * Rendering a header, and content if it's open
 *   * Rendering a chevron to signal accordion state.
 */
interface Props {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => unknown;
  // If you want to defer rendering or customize chevron, use a function
  header: React.ReactNode | ((defaultChevron: React.ReactNode) => React.ReactNode);
  content: React.ReactNode | (() => React.ReactNode);
}

const Accordion: React.SFC<Props> = (props) => {
  const defaultChevron = props.isOpen ?
    <i className="fa fa-chevron-right"/> :
    <i className="fa fa-chevron-down"/>;

  return (
    <React.Fragment>
      <span onClick={() => props.onToggle(props.isOpen)}>
        {isFunction(props.header) ?
          props.header(defaultChevron) :
          <React.Fragment>
            {props.header}
            {defaultChevron}
          </React.Fragment>
        }
      </span>
      {props.isOpen &&
        (isFunction(props.content) ?
          props.content() : props.content
        )
      }
    </React.Fragment>
  );
};

export default Accordion;
