/// Our application specific sun/shade constants and conversions
library;

import 'dart:math' as math;
import 'package:latlong2/latlong.dart';

import 'suncalc.dart' as suncalc;

typedef Vector2 = (double, double);

/// How much sun does some vector get
///
/// Checks sun value for angle [inputVector] at [coordinate] at [time].
/// Returns from 0 being not so much sun to 1 being lots of sun
getNormalizedSunValue({
  required Vector2 inputVector, // vector we are checking for sun angle
  required LatLng coordinate,
  DateTime? time,
}) {
  final sunPosition = suncalc.getPosition(
    time: time ?? DateTime.now(),
    lat: coordinate.latitude,
    lng: coordinate.longitude,
  );
  final altitudeValue = sunPosition.altitude / (pi / 2);
  final Vector2 azimuthUnitVector = (
    math.cos(suncalc.toRadians(sunPosition.azimuth) + math.pi),
    math.sin(suncalc.toRadians(sunPosition.azimuth) + math.pi),
  );
  final Vector2 inputUnitVector = (
    inputVector.$1 / _magnitude(inputVector),
    inputVector.$2 / _magnitude(inputVector),
  );
  final inputSunAngle = _getAngle(inputUnitVector, azimuthUnitVector);
  final angleValue = 1 - inputSunAngle / 180;

  // The weighted values here could probably use some tweaking.
  // Direct low sun versus indirect high sun, hard to say what is best
  return 0.4 * altitudeValue + 0.6 * angleValue;
}

_magnitude(Vector2 v) {
  return math.sqrt(v.$1 * v.$1 + v.$2 * v.$2);
}

_getAngle(Vector2 a, Vector2 b) {
  return suncalc.toDegrees(
      math.acos(_dotProduct(a, b) / (_magnitude(a) * _magnitude(b))));
}

_dotProduct(Vector2 a, Vector2 b) {
  return a.$1 * b.$1 + a.$2 * b.$2;
}
