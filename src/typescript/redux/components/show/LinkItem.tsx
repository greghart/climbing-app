import * as React from 'react';
import { Link } from 'react-router-dom';
import ActionItem from './ActionItem';

/**
 * A skeleton for an item action link entry
 *
 * An LinkItem when the action is a link
 */
interface LinkProps {
  icon?: string;
  to: string;
  children: React.ReactNode;
}
const LinkItem: React.FunctionComponent<LinkProps> = (props) => {
  return (
    <li className="list-group-item list-group-item-action">
      <Link to={props.to}>
        <ActionItem includeLi={false} {...props} />
      </Link>
    </li>
  );
};

export default LinkItem;
