import * as Promise from 'bluebird';
import { Connection } from 'typeorm';
import getConnection from './getConnection';

/**
 * Just maintain a single connection
 *
 * @example
 */
let _connection: Promise.Thenable<Connection>;

const getSingleConnection = () => {
  if (_connection) {
    return _connection;
  }
  _connection = getConnection();
  return _connection;
};

export default getSingleConnection;
