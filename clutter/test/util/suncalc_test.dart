import 'package:clutter/util/julian.dart';
import 'package:clutter/util/suncalc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final time = DateTime.utc(2004, 4, 1, 12);
  const JulianDay sampleJDay = 2453097;

  group('julianCycle', () {
    test('calculates correctly', () {
      expect(toDays(time), closeTo(sampleJDay, .0001));
    });
  });

  group('solarMeanAnomaly', () {
    test('calculates correctly', () {
      expect(solarMeanAnomaly(sampleJDay), closeTo(87.1807, .0001));
    });
  });

  group('kepler', () {
    test('calculates correctly', () {
      expect(kepler(87.1807), closeTo(1.9142, .0001));
    });
  });

  group('trueAnomaly', () {
    test('calculates correctly', () {
      expect(trueAnomaly(87.1807), closeTo(89.0949, .0001));
    });
  });

  group('eclipticLongitude', () {
    test('calculates correctly', () {
      expect(eclipticLongitude(87.1807), closeTo(12.0322, .0001));
    });
  });

  group('rightAscension', () {
    test('calculates correctly', () {
      expect(rightAscension(12.0322), closeTo(11.0649, .0001));
    });
  });

  group('declination', () {
    test('calculates correctly', () {
      expect(declination(12.0322), closeTo(4.7565, .0001));
    });
  });

  group('siderealTime', () {
    test('calculates correctly', () {
      expect(siderealTime(sampleJDay, -5), closeTo(14.8347, .0001));
    });
  });

  group('altitude', () {
    test('calculates correctly', () {
      expect(
          altitude(
            hourAngle:
                hourAngle(rightAscension: 11.0649, siderealTime: 14.8347),
            lat: 52,
            declination: 4.7565,
          ),
          closeTo(42.6530, .0001));
    });
  });

  group('azimuth', () {
    test('calculates correctly', () {
      expect(
          azimuth(
            hourAngle:
                hourAngle(rightAscension: 11.0649, siderealTime: 14.8347),
            lat: 52,
            declination: 4.7565,
          ),
          closeTo(5.1111, .0001));
    });
  });

  group('getPosition', () {
    test('calculates correctly for given netherlands data', () {
      final pos = getPosition(
        time: DateTime.utc(2004, 4, 1, 12),
        lat: 52,
        lng: 5,
      );
      expect(pos.altitude, closeTo(42.6530, .0001));
      expect(pos.azimuth, closeTo(5.1111, .0001));
    });

    test('calculates correctly for Santee', () {
      final am = getPosition(
        time: DateTime(2025, 1, 13, 8, 0, 0),
        lat: 32.85052,
        lng: -117.02223,
      );
      // Eastern sun at a low angle
      expect(am.altitude, closeTo(11.5896, .0001));
      expect(am.azimuth, closeTo(-54.8056, .0001));

      final noon = getPosition(
        time: DateTime(2025, 1, 13, 12, 0, 0),
        lat: 32.85052,
        lng: -117.02223,
      );
      // Southern sun at a mid angle!
      expect(noon.altitude, closeTo(35.7461, .0001));
      expect(noon.azimuth, closeTo(.7681, .0001));

      final pm = getPosition(
        time: DateTime(2025, 1, 13, 16, 0, 0),
        lat: 32.85052,
        lng: -117.02223,
      );
      // Western sun at a low angle
      expect(pm.altitude, closeTo(10.70398, .0001));
      expect(pm.azimuth, closeTo(55.702, .0001));
    });
  });
}
