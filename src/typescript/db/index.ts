import * as Bluebird from 'bluebird';
import { Connection } from 'typeorm';
import getConnection from './getConnection';

/**
 * Just maintain a single connection
 *
 * @example
 */
let _connection: Bluebird<Connection>;

const getSingleConnection = () => {
  if (_connection) {
    return _connection;
  }
  _connection = Bluebird.resolve(getConnection());
  return _connection;
};

export default getSingleConnection;
