import expect from "../../expect";
import { getAngle } from "../../../src/typescript/util/mapLib";

describe('mapLib', () => {

  describe('getAngle', () => {

    it('should return a number for a valid vector', () => {
      expect(
        getAngle({ x: 0, y: 1 }, { x: 1, y: 0 })
      ).to.be.a('number');
    })

    it('should return correct values', () => {
      // 90 degree angle
      expect(
        getAngle({ x: 0, y: 1 }, { x: 1, y: 0 })
      ).to.equal(90);
      expect(
        getAngle({ x: 0, y: 1 }, { x: 0, y: -1 })
      ).to.equal(180);
    });

  });
});
