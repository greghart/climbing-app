import Bluebird from 'bluebird';
import { Connection } from 'typeorm';
import getConnection from './getConnection';

/**
 * Just maintain a single connection pool
 *
 * Actually, typeorm manages active connection internally, so as long as we
 * create a connection, we can directly use typeorm API...neat!
 */
let connection: Bluebird<Connection>;

const getSingleConnection = () => {
  if (connection) {
    return connection;
  }
  connection = Bluebird.resolve(getConnection());
  return connection;
};

export default getSingleConnection;
