import * as React from 'react';

/**
 * A skeleton for an item info entry
 *
 * Aligns an icon and some children
 */
interface InfoProps {
  icon: string;
  children: React.ReactNode;
}
const InfoItem: React.SFC<InfoProps> = (props) => {
  return (
    <li className="list-group-item list-group-item-action">
      <div className="row align-items-center">
        <div className="col-1">
          <i className={`fa fa-${props.icon} text-primary`} />
        </div>
        <div className="col">{props.children}</div>
      </div>
    </li>
  )
}

export default InfoItem;
