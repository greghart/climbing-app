import React from 'react';
import { withRouter } from 'next/router';
// import getClient from '../src/typescript/api/clients/getClient';
import RouteLayout from '../src/typescript/redux/components/routes/RouteLayout';

const a: number = 2;

const Route = withRouter((props) => {
  return (
    <RouteLayout route={props.route} />
  );
});

Route.getInitialProps = async function getRoute(context) {
  // const client = getClient();
  // const data = await client.routes.getRoute(context.query.id, true);
  const data = {};
  console.log(data);

  return {
    route: data
  };
};

export default Route;
