import * as React from 'react';
import Truncate from '../Truncate';
import { Link } from 'react-router-dom';

interface LinkDatum {
  to?: string;
  content: React.ReactNode;
}

interface Props {
  title: React.ReactNode;
  links: LinkDatum[];
}

// Breadcrumbs will truncate and allow dropdown
const ShowBreadcrumbs: React.SFC<Props> = (props) => {
  return (
    <div className="dropdown w-100 text-center">
      <a
        className="btn btn-link"
        role="button"
        id="breadcrumbsLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {props.title}
        {props.links.length > 0 &&
          <i className="fa fa-caret-down ml-2" />
        }
      </a>
      {props.links.length > 0 &&
        <div className="dropdown-menu" aria-labelledby="breadcrumbsLink">
          {props.links.map((thisLink, i) => {
            if (!thisLink.to) {
              return(
                <a key={thisLink.to || i} className="dropdown-item">
                  {thisLink.content}
                </a>
              );
            }
            return (
              <Link key={thisLink.to} to={thisLink.to} className="dropdown-item">
                {thisLink.content}
              </Link>
            );
          })}
        </div>
      }

    </div>
  );
};

export default ShowBreadcrumbs;
