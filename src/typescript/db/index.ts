import * as Bluebird from 'bluebird';
import { Connection } from 'typeorm';
import getConnection from './getConnection';

/**
 * Just maintain a single connection pool
 *
 * Actually, typeorm manages active connection internally, so as long as we
 * create a connection, we can directly use typeorm API...neat!
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
