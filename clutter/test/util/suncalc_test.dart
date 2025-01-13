import 'package:clutter/util/julian.dart';
import 'package:clutter/util/suncalc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  const JulianDay sampleJDay = 2453097;

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
}
