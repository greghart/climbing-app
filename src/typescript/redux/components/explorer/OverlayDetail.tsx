import * as React from 'react';
import { Link } from 'react-router-dom';

/**
 * Our overlay details are cards with a title and content
 */
interface Props {
  header: React.ReactNode;
  content: React.ReactNode;
  // Optional link to allow opening up into
  linkTo?: string;
}

const OverlayDetail: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="card">
      <h6 className="card-header">
        {props.header}
        {props.linkTo && (
          <Link to={props.linkTo} className="ml-2">
            <i className="fa fa-external-link-alt" />
          </Link>
        )}
      </h6>
      <div className="card-body">
        {props.content}
      </div>
    </div>
  );
};

export default OverlayDetail;
