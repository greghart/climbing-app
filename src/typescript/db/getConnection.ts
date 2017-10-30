import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import * as _debug from 'debug';
const debug = _debug('climbing-app:typeorm');

Bluebird.promisifyAll(fs);
import GradingSystem from '../models/GradingSystem';
import Grade from '../models/Grade';
import Crag from '../models/Crag';
import parseCrag from './parseCrag';

function getConnection() {
  return createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'greghart',
    password: undefined,
    database: 'greghart',
    entities: [
      __dirname + '/../models/*.ts'
    ],
    synchronize: true,
    logging: true
  })
  .catch((err) => {
    console.error("Error on TypeORM database setup");
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
    const dataRaw = await Bluebird.promisify(fs.readFile)(
      path.join(__dirname, '../../../static/data/TramData.json')
    )
    const data = JSON.parse(dataRaw.toString());
    const crag = parseCrag(data);
    await connection.manager.save(crag);

    console.log("Database connection successfully setup");
    return Promise.resolve(connection);
  });
}

export default getConnection;