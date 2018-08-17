import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as pg from 'pg';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as config from 'config';
import * as _debug from 'debug';
const debug = _debug('climbing-app:typeorm');

Bluebird.promisifyAll(fs);
import GradingSystem from '../models/GradingSystem';
import Grade from '../models/Grade';
import Crag from '../models/Crag';
import parseCrag from './parseCrag';

// Abstraction leak
// Make sure underlying db driver parses our decimals as a float
// Obviously this isn't entirely safe
pg.types.setTypeParser(1700, (v:any) => parseFloat(v));

function getConnection() {
  return createConnection({
    type: 'postgres',
    host: config.get<string>('server.postgres.host'),
    port: config.get<number>('server.postgres.port'),
    username: config.get<string>('server.postgres.username'),
    password: config.get<string>('server.postgres.password'),
    database: config.get<string>('server.postgres.database'),
    entities: [
      __dirname + '/../models/*.ts'
    ],
    dropSchema: true,
    synchronize: true,
    logging: true
  })
  .catch((err) => {
    console.error('Error on TypeORM database setup');
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (connection: Connection) => {
    // Application level fixtures
    // TODO Refactor
    // V-Grade
    const vGrading = new GradingSystem();
    vGrading.name = 'Vermin (V) Scale';
    vGrading.type = 'boulder';
    vGrading.grades = [
      'B', ...Array.from({ length: 18 }, (v, i) => i)
    ].map((g, i) => {
      const grade = new Grade();
      grade.name = `V${g}`;
      grade.order = i;
      return grade;
    });

    const systems = await connection.manager.find(GradingSystem);
    await connection.manager.remove(systems);
    await connection.manager.save(vGrading);

    // Load our static crags
    const loadStaticCrag = async (fileName) => {
      const dataRaw = await Bluebird.promisify(fs.readFile)(
        path.join(__dirname, `../../../static/data/${fileName}`)
      );
      const data = JSON.parse(dataRaw.toString());
      const crag = parseCrag(data);
      await connection.manager.save(crag);
    };
    await loadStaticCrag('TramData.json');
    await loadStaticCrag('Santee.json');

    console.log('Database connection successfully setup');
    return Promise.resolve(connection);
  });
}

export default getConnection;
