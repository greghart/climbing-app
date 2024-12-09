import { expect } from "power-putty-test";
import * as Grade from "./Grade.js";

describe("YDS", () => {
  const invalidScores = [
    "",
    "V0",
    "5.16a", // not yet!
    "5.",
    "5.0",
    "V5.10",
  ];
  const expectedScores = [
    { raw: "5.1", expected: -6 },
    { raw: "5.2", expected: -5 },
    { raw: "5.3", expected: -4 },
    { raw: "5.4", expected: -3 },
    { raw: "5.5", expected: -2 },
    { raw: "5.6", expected: -1 },
    { raw: "5.7", expected: 0 },
    { raw: "5.8", expected: 9 },
    { raw: "5.9", expected: 10 },
    { raw: "5.10a", expected: 11 },
    { raw: "5.10b", expected: 12 },
    { raw: "5.10c", expected: 20 },
    { raw: "5.10d", expected: 25 },
    { raw: "5.11a", expected: 30 },
    { raw: "5.11b", expected: 31 },
    { raw: "5.11c", expected: 40 },
    { raw: "5.11d", expected: 41 },
    { raw: "5.12a", expected: 50 },
    { raw: "5.12b", expected: 60 },
    { raw: "5.12c", expected: 70 },
    { raw: "5.12d", expected: 80 },
    { raw: "5.13a", expected: 90 },
    { raw: "5.13b", expected: 91 },
    { raw: "5.13c", expected: 100 },
    { raw: "5.13d", expected: 110 },
    { raw: "5.14a", expected: 120 },
    { raw: "5.14b", expected: 130 },
    { raw: "5.14c", expected: 140 },
    { raw: "5.14d", expected: 150 },
    { raw: "5.15a", expected: 160 },
    { raw: "5.15b", expected: 170 },
    { raw: "5.15c", expected: 180 },
    // . support
    { raw: ".7", expected: 0 },
    // +/-
    { raw: ".7-", expected: -1 },
    { raw: ".7+", expected: 1 },
  ];

  describe("parseRawYDSScore", () => {
    for (const raw of invalidScores) {
      it(`validates '${raw}' as invalid`, () => {
        expect(() => Grade.parseRawYDSScore(raw)).to.throw(
          RangeError,
          `Invalid YDS grade '${raw}'`
        );
      });
    }

    for (const { raw, expected } of expectedScores) {
      it(`parses '${raw}' as ${expected}`, () => {
        expect(Grade.parseRawYDSScore(raw)).to.equal(expected);
      });
    }
  });

  describe("parseRawYDS", () => {
    const invalid = ["5.10/", "5.10/5.16", "5.10/V5"].concat(invalidScores);
    for (const raw of invalid) {
      it(`validates '${raw}' as invalid`, () => {
        expect(() => Grade.parseRawYDS(raw)).to.throw(
          RangeError,
          `Invalid YDS grade '${raw}'`
        );
      });
    }

    const tests = expectedScores.concat([
      { raw: "5.12b/12c", expected: 65 },
      { raw: "5.12b/5.12c", expected: 65 },
      { raw: "5.12b/.12c", expected: 65 },
    ]);
    for (const { raw, expected } of tests) {
      it(`parses '${raw} as grade with value ${expected}`, () => {
        const grade = Grade.parseRawYDS(raw);
        expect(grade.system).to.equal(Grade.GradingSystemType.YDS);
        expect(grade.raw).to.equal(raw);
        expect(grade.value).to.equal(expected);
      });
    }
  });
});

describe("V scale", () => {
  const invalidScores = [
    "",
    "5.10",
    "V-1",
    "V18", // not yet!
    "V",
    "V5.2",
    "V5.10",
  ];
  const expectedScores = [
    { raw: "VB", expected: 0 },
    { raw: "V0", expected: 10 },
    { raw: "V1", expected: 20 },
    { raw: "V2", expected: 30 },
    { raw: "V3", expected: 40 },
    { raw: "V4", expected: 50 },
    { raw: "V5", expected: 60 },
    { raw: "V6", expected: 70 },
    { raw: "V7", expected: 80 },
    { raw: "V8", expected: 90 },
    { raw: "V9", expected: 100 },
    { raw: "V10", expected: 110 },
    { raw: "V11", expected: 120 },
    { raw: "V12", expected: 130 },
    { raw: "V13", expected: 140 },
    { raw: "V14", expected: 150 },
    { raw: "V15", expected: 160 },
    { raw: "V16", expected: 170 },
    { raw: "V17", expected: 180 },
    // +/-
    { raw: "VB-", expected: -1 },
    { raw: "VB+", expected: 1 },
  ];

  describe("parseRawVScore", () => {
    for (const raw of invalidScores) {
      it(`validates '${raw}' as invalid`, () => {
        expect(() => Grade.parseRawVScore(raw)).to.throw(
          RangeError,
          `Invalid V grade '${raw}'`
        );
      });
    }

    for (const { raw, expected } of expectedScores) {
      it(`parses '${raw}' as ${expected}`, () => {
        expect(Grade.parseRawVScore(raw)).to.equal(expected);
      });
    }
  });

  describe("parseRawV", () => {
    const invalid = ["V2/", "VB/V18", "V5/5.10"].concat(invalidScores);
    for (const raw of invalid) {
      it(`validates '${raw}' as invalid`, () => {
        expect(() => Grade.parseRawV(raw)).to.throw(
          RangeError,
          `Invalid V grade '${raw}'`
        );
      });
    }

    const tests = expectedScores.concat([
      { raw: "VB/V0-", expected: 4.5 },
      { raw: "VB/V0", expected: 5 },
      { raw: "VB/0", expected: 5 },
      { raw: "VB/V1", expected: 10 }, // Kind of a weird one, but allowed for now
    ]);
    for (const { raw, expected } of tests) {
      it(`parses '${raw} as grade with value ${expected}`, () => {
        const grade = Grade.parseRawV(raw);
        expect(grade.system).to.equal(Grade.GradingSystemType.V);
        expect(grade.raw).to.equal(raw);
        expect(grade.value).to.equal(expected);
      });
    }
  });
});
