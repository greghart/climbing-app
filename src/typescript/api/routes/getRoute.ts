import { Operation } from '../action';
import getConnection from '../../db';
import Route, { Client } from '../../models/Route';
import omit = require('lodash/omit');

const getRoute: Operation<[string, { includeComments: boolean }], Client> = ([id, { includeComments }]) => {
  const relations = ['boulder', 'boulder.area', 'boulder.area.crag'];
  console.log({ includeComments });
  if (includeComments) {
    relations.push('commentable');
    relations.push('commentable.comments');
    relations.push('commentable.comments.user');
  }
  return getConnection()
  .then(async (connection) => {
    const routeRepository = connection.getRepository(Route);
    return await routeRepository.findOneById(id, { relations });
  });
};

export default getRoute;
