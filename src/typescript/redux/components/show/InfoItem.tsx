import * as React from 'react';

/**
 * A skeleton for an item info entry
 *
 * Aligns an icon and some children
 */
interface InfoProps {
  icon: string;
  children: React.ReactNode;
  includeLi?: boolean;
}

const InfoItem: React.SFC<InfoProps> = (props) => {
  const body = (
    <div className="row align-items-center">
      <div className="col-1">
        <i className={`fa fa-${props.icon} text-primary`} />
      </div>
      <div className="col">{props.children}</div>
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
};

InfoItem.defaultProps = {
  includeLi: true,
};
export default InfoItem;
