import * as React from 'react';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';
import Route from '../../../models/Route';

interface Props {
  route?: Route;
}

const RouteLayout: React.SFC<Props> = (props) => {
  console.warn({ props }, 'ROuteLayout')
  return (
    <PageLayout
      key="route"
      header={
        <GoBackHeader
          input={
            <div className="input-group-append grow-up">
              <button className="btn btn-light border-left w-100">
                {props.route.name}
              </button>
            </div>
          }
        />
      }
      content={
        <div className="card pb-2">
          <div className="card-body">
            Route Info
          </div>
        </div>
      }
    />
  );
}
RouteLayout.defaultProps = {
  route: {
    id: 1,
    name: 'Test Route',
    gradeRaw: 'v12'
  } as any
};

export default RouteLayout;
