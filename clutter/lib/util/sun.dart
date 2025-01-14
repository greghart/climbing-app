/// Our application specific sun/shade constants and conversions
library;

import 'dart:math' as math;
import 'package:latlong2/latlong.dart';

import 'suncalc.dart' as suncalc;

typedef Vector2 = (double, double);

/// How much sun does some vector get
///
/// Checks sun value for angle [inputVector] against given [sunPosition].
/// Returns from 0 being not so much sun to 1 being lots of sun
double getSunValue({
  required Vector2 inputVector, // vector we are checking for sun angle
  required suncalc.SunPosition sunPosition,
}) {
  final altitudeValue = sunPosition.altitude / 90;
  final Vector2 azimuthUnitVector = (
    math.cos(suncalc.toRadians(sunPosition.azimuth) + math.pi),
    math.sin(suncalc.toRadians(sunPosition.azimuth) + math.pi),
  );
  final Vector2 inputUnitVector = (
    inputVector.$1 / magnitude(inputVector),
    inputVector.$2 / magnitude(inputVector),
  );
  final inputSunAngle = _getAngle(inputUnitVector, azimuthUnitVector);
  final angleValue = 1 - inputSunAngle / 180;

  // The weighted values here could probably use some tweaking.
  // Direct low sun versus indirect high sun, hard to say what is best
  return 0.4 * altitudeValue + 0.6 * angleValue;
}

double magnitude(Vector2 v) {
  return math.sqrt(v.$1 * v.$1 + v.$2 * v.$2);
}

Vector2 rotate(Vector2 v, double degrees) {
  final radians = suncalc.toRadians(degrees);
  return (
    math.cos(radians) * v.$1 - math.sin(radians) * v.$2,
    math.sin(radians) * v.$1 + math.cos(radians) * v.$2,
  );
}

const _rEarth = 6378;
LatLng offsetBy(LatLng c, double kmLat, double kmLng) {
  return LatLng(
    c.latitude + suncalc.toDegrees(kmLat / _rEarth),
    c.longitude +
        suncalc.toDegrees(kmLng / _rEarth) /
            math.cos(suncalc.toRadians(c.latitude)),
  );
}

// PRIVATE METHODS
_getAngle(Vector2 a, Vector2 b) {
  return suncalc
      .toDegrees(math.acos(_dotProduct(a, b) / (magnitude(a) * magnitude(b))));
}

_dotProduct(Vector2 a, Vector2 b) {
  return a.$1 * b.$1 + a.$2 * b.$2;
}
