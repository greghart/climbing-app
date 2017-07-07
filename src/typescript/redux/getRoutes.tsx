import * as React from 'react';
import { RouteConfig } from 'react-router-config';

// Import all containers here
const HelloWorld = () => {
  return (
    <h1>Hello World 2</h1>
  );
};

/**
 * App encapsulates the full routes markup that our app consists of
 */
export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '/',
      component: HelloWorld
    }
  ];
}
