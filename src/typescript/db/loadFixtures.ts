import { DataSource } from "typeorm";
import Bluebird from "bluebird";
import * as fs from "fs";
Bluebird.promisifyAll(fs);
import * as path from "path";

import GradingSystem from "../models/GradingSystem";
import Grade from "../models/Grade";
import parseCrag from "./parseCrag";
import User from "../models/User";

import _debug from "../debug";
const debug = _debug.extend("db:loadFixtures");

// Application level fixtures
// @todo V-Grade
const loadFixtures = async (ds: DataSource) => {
  const vGrading = new GradingSystem();
  vGrading.name = "Vermin (V) Scale";
  vGrading.type = "boulder";
  vGrading.grades = ["B", ...Array.from({ length: 18 }, (v, i) => i)].map(
    (g, i) => {
      const grade = new Grade();
      grade.name = `V${g}`;
      grade.order = i;
      return grade;
    }
  );

  await ds.manager.save(vGrading);

  // Load base user
  const admin = new User();
  admin.email = "greghartemail@gmail.com";
  admin.name = "Greg Hart";
  await ds.manager.save(admin);

  // Load our static crags
  const loadStaticCrag = async (fileName) => {
    const dataRaw = await Bluebird.promisify(fs.readFile)(
      path.join(__dirname, `../../../static/data/${fileName}`)
    );
    const data = JSON.parse(dataRaw.toString());
    const crag = parseCrag(data);
    await ds.manager.save(crag);
  };
  await loadStaticCrag("TramData.json");
  await loadStaticCrag("Santee.json");

  debug("Database connection successfully setup");
};

export default loadFixtures;
