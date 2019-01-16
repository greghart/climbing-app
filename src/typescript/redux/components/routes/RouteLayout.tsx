import * as React from 'react';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';
import Route from '../../../models/Route';
import RouteBreadcrumbs from './RouteBreadcrumbs';

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
          groupClass="flex-no-wrap"
          input={
            <div className="input-group-append flex-grow-up">
              <RouteBreadcrumbs route={props.route} />
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
    gradeRaw: 'v12',
    boulder: {
      name: 'EZ Boulder',
      area: {
        name: 'TramWay'
      }
    }
  } as any
};

export default RouteLayout;
