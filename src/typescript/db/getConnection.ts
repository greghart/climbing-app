import { createConnection, Connection } from 'typeorm';
import * as pg from 'pg';
import Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import config from 'config';

Bluebird.promisifyAll(fs);
import GradingSystem from '../models/GradingSystem';
import Grade from '../models/Grade';
import parseCrag from './parseCrag';
import User from '../models/User';

import _debug from '../debug';
const debug = _debug.extend('db:getConnection');

// Abstraction leak
// Make sure underlying db driver parses our decimals as a float
// Obviously this isn't entirely safe
pg.types.setTypeParser(1700, (v:any) => parseFloat(v));

// Application level fixtures
// @todo V-Grade
const loadFixtures = async (connection: Connection) => {
  const vGrading = new GradingSystem();
  vGrading.name = 'Vermin (V) Scale';
  vGrading.type = 'boulder';
  vGrading.grades = [
    'B', ...Array.from({ length: 18 }, (v, i) => i),
  ].map((g, i) => {
    const grade = new Grade();
    grade.name = `V${g}`;
    grade.order = i;
    return grade;
  });

  await connection.manager.save(vGrading);

  // Load base user
  const admin = new User();
  admin.email = 'greghartemail@gmail.com';
  admin.name = 'Greg Hart';
  await connection.manager.save(admin);

  // Load our static crags
  const loadStaticCrag = async (fileName) => {
    const dataRaw = await Bluebird.promisify(fs.readFile)(
      path.join(__dirname, `../../../static/data/${fileName}`),
    );
    const data = JSON.parse(dataRaw.toString());
    const crag = parseCrag(data);
    await connection.manager.save(crag);
  };
  await loadStaticCrag('TramData.json');
  await loadStaticCrag('Santee.json');

  debug('Database connection successfully setup');
};

function getConnection() {
  return createConnection({
    type: 'sqlite',
    database: config.get<string>('database.sqlite.database'),
    // type: 'postgres',
    // host: config.get<string>('database.postgres.host'),
    // port: config.get<number>('database.postgres.port'),
    // username: config.get<string>('database.postgres.username'),
    // password: config.get<string>('database.postgres.password'),
    // database: config.get<string>('database.postgres.database'),
    entities: [
      `${__dirname}/../models/*`,
    ],
    dropSchema: config.get<boolean>('database.sync'),
    synchronize: config.get<boolean>('database.sync'),
    logging: true,
  })
  .then(async (connection) => {
    if (config.get<boolean>('database.sync')) {
      await loadFixtures(connection);
    }
    return connection;
  })
  .catch((err) => {
    console.error('Error on TypeORM database setup');
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
    throw(err);
  });
}

export { loadFixtures };
export default getConnection;
