import * as React from 'react';

/**
 * A skeleton for an item action entry
 *
 * Aligns an icon and some children but in a way for actions
 */
interface ActionProps {
  icon?: string;
  children: React.ReactNode;
  includeLi?: boolean;
}
const ActionItem: React.FunctionComponent<ActionProps> = (props) => {
  const body = (
    <div className="row justify-content-between align-items-center">
      <div className="col">
        {props.children}
      </div>
      <div className="col-1">
        <i className={`fa fa-${props.icon} text-primary`} />
      </div>
    </div>
  );
  if (props.includeLi) {
    return (
      <li className="list-group-item list-group-item-action">
        {body}
      </li>
    );
  }
  return body;
}

ActionItem.defaultProps = {
  icon: 'chevron-right',
  includeLi: true
};

export default ActionItem;
