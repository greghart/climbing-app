// Adapted to dart from https://github.com/mourner/suncalc.
// @see {https://aa.quae.nl/en/reken/zonpositie.html} also
// Main complication to keep in mind is dart math lib wants radians, some
// of these equations want degrees, so needs care in conversion.
library;

import 'dart:math' as math;

import 'julian.dart';

// calculates sun position for a given date and latitude/longitude
({Degrees azimuth, Degrees altitude}) getPosition({
  required DateTime time,
  required double lat,
  required double lng,
}) {
  JulianDay d = toDays(time);

  final sc = sunCoords(d);
  Degrees ha = hourAngle(
    rightAscension: sc.rightAscension,
    siderealTime: siderealTime(d, lng),
  );

  return (
    azimuth: azimuth(hourAngle: ha, lat: lat, declination: sc.declination),
    altitude: altitude(hourAngle: ha, lat: lat, declination: sc.declination),
  );
}

// Keep code clear when we're working in degrees vs radians
typedef Radians = num;
typedef Degrees = num;

Radians toRadians(Degrees d) {
  return d * math.pi / 180;
}

Degrees toDegrees(Radians r) {
  return r * 180 / math.pi;
}

// shortcuts for easier to read formulas
const double _pi = 3.141592653589793;
const double _rad = _pi / 180;
double _sin(Radians x) => math.sin(x);
double _cos(Radians x) => math.cos(x);
double _tan(Radians x) => math.tan(x);
Radians _asin(double x) => math.asin(x);
Radians _atan2(double y, double x) => math.atan2(y, x);
Radians _acos(double x) => math.acos(x);

const _m0 = 357.5291;
const _m1 = 0.98560028;
// Mean Anomaly
// @see {https://aa.quae.nl/en/reken/zonpositie.html#2}
// m0 and m1 come from table for 'Earth' entry
Degrees solarMeanAnomaly(JulianDay d) => (_m0 + _m1 * (d - j2000)) % 360;

// The equation of the center
// @see {https://aa.quae.nl/en/reken/zonpositie.html#3}
// coefficients come from table for 'Earth' entry
// C
double kepler(Degrees meanAnomaly) {
  final rads = toRadians(meanAnomaly);
  return (1.9148 * _sin(rads) +
      0.02 * _sin(2 * rads) +
      0.0003 * _sin(3 * rads));
}

// ν
double trueAnomaly(Degrees meanAnomaly) {
  return meanAnomaly + kepler(meanAnomaly);
}

// Perihelion and the Obliquity of the Ecliptic
// @see {https://aa.quae.nl/en/reken/zonpositie.html#4}
// coefficients come from table for 'Earth' entry
const Degrees _eclipticLongitudePerihelion = 102.9373;
const Degrees _obliquityEquator = 23.4393;
final Radians _obliquityEquatorRadians = toRadians(_obliquityEquator);

// Ecliptic Coordinates
// @see {https://aa.quae.nl/en/reken/zonpositie.html#5}
// @returns longtitude of sun as seen from planet (ie + 180 deg)
// λ
Degrees eclipticLongitude(Degrees meanAnomaly) {
  return (trueAnomaly(meanAnomaly) + _eclipticLongitudePerihelion + 180) % 360;
}
// NOTE, ecliptic latitude is close enough to 0 to be ignored

// Equatorial Coordinates
// @see {https://aa.quae.nl/en/reken/zonpositie.html#6}
// We use the more accurate equations for now since perf should be fine
// α
Degrees rightAscension(Degrees eclipticLongitude) {
  final rads = toRadians(eclipticLongitude);
  return toDegrees(
    _atan2(
      _sin(rads) * _cos(_obliquityEquatorRadians),
      _cos(rads),
    ),
  );
}

// δ
Degrees declination(Degrees eclipticLongitude) {
  return toDegrees(
    _asin(
      _sin(toRadians(eclipticLongitude)) * _sin(_obliquityEquatorRadians),
    ),
  );
}

// @see {https://aa.quae.nl/en/reken/zonpositie.html#7}
// theta0 and theta1 come from table for 'Earth' entry
const _theta0 = 280.1470;
const _theta1 = 360.9856235;
// θ
Degrees siderealTime(JulianDay d, double longitudeWest) =>
    (_theta0 + _theta1 * (d - j2000) - longitudeWest) % 360;

Degrees hourAngle(
    {required Degrees rightAscension, required Degrees siderealTime}) {
  return siderealTime - rightAscension;
}

Degrees altitude(
    {required Degrees hourAngle,
    required Degrees lat,
    required Degrees declination}) {
  final haRads = toRadians(hourAngle);
  final latRads = toRadians(lat);
  final decRads = toRadians(declination);
  return toDegrees(
    _asin(
      _sin(latRads) * _sin(decRads) +
          _cos(latRads) * _cos(decRads) * _cos(haRads),
    ),
  );
}

Degrees azimuth(
    {required Degrees hourAngle,
    required Degrees lat,
    required Degrees declination}) {
  final haRads = toRadians(hourAngle);
  final latRads = toRadians(lat);
  return toDegrees(
    _atan2(
      _sin(haRads),
      _cos(haRads) * _sin(latRads) -
          _tan(toRadians(declination)) * _cos(latRads),
    ),
  );
}

({Degrees declination, Degrees rightAscension}) sunCoords(JulianDay d) {
  Degrees ma = solarMeanAnomaly(d);
  Degrees el = eclipticLongitude(ma);
  return (
    declination: declination(el),
    rightAscension: rightAscension(el),
  );
}

// Radians rightAscension(Radians l, Radians b) =>
//     _atan2(_sin(l) * _cos(e) - _tan(b) * _sin(e), _cos(l));
// Radians declination(Radians l, Radians b) =>
//     _asin(_sin(b) * _cos(e) + _cos(b) * _sin(e) * _sin(l));

// double azimuth(double H, double phi, double dec) =>
//     _atan2(_sin(H), _cos(H) * _sin(phi) - _tan(dec) * _cos(phi));
// double altitude(double H, double phi, double dec) =>
//     _asin(_sin(phi) * _sin(dec) + _cos(phi) * _cos(dec) * _cos(H));

// double astroRefraction(double h) {
//   // the following formula works for positive altitudes only.
//   // if h = -0.08901179 a div/0 would occur.
//   if (h < 0) h = 0;
//   // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
//   // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
//   return 0.0002967 / _tan(h + 0.00312536 / (h + 0.08901179));
// }

// // general sun calculations

// // sun times configuration (angle, morning name, evening name)
// List<List<dynamic>> times = [
//   [-0.833, 'sunrise', 'sunset'],
//   [-0.3, 'sunriseEnd', 'sunsetStart'],
//   [-6, 'dawn', 'dusk'],
//   [-12, 'nauticalDawn', 'nauticalDusk'],
//   [-18, 'nightEnd', 'night'],
//   [6, 'goldenHourEnd', 'goldenHour']
// ];

// // adds a custom time to the times config
// void addTime(double angle, String riseName, String setName) {
//   times.add([angle, riseName, setName]);
// }

// // calculations for sun times
// const double j0 = 0.0009;

// double julianCycle(double d, double lw) =>
//     (d - j0 - lw / (2 * _pi)).roundToDouble();
// double approxTransit(double ht, double lw, double n) =>
//     j0 + (ht + lw) / (2 * _pi) + n;
// double solarTransitJ(double ds, double M, double L) =>
//     j2000 + ds + 0.0053 * _sin(M) - 0.0069 * _sin(2 * L);

// double hourAngle(double h, double phi, double d) =>
//     _acos((_sin(h) - _sin(phi) * _sin(d)) / (_cos(phi) * _cos(d)));
// double observerAngle(double height) => -2.076 * math.sqrt(height) / 60;

// // returns set time for the given sun altitude
// double getSetJ(
//     double h, double lw, double phi, double dec, double n, double M, double L) {
//   double w = hourAngle(h, phi, dec);
//   double a = approxTransit(w, lw, n);
//   return solarTransitJ(a, M, L);
// }

// // calculates sun times for a given date, latitude/longitude, and, optionally, the observer height (in meters) relative to the horizon
// Map<String, DateTime> getTimes(DateTime date, double lat, double lng,
//     [double height = 0]) {
//   double lw = _rad * -lng;
//   double phi = _rad * lat;
//   double dh = observerAngle(height);
//   double d = toDays(date);
//   double n = julianCycle(d, lw);
//   double ds = approxTransit(0, lw, n);
//   double M = solarMeanAnomaly(ds);
//   double L = kepler(M);
//   double dec = declination(L, 0);
//   double jNoon = solarTransitJ(ds, M, L);

//   Map<String, DateTime> result = {
//     'solarNoon': fromJulian(jNoon),
//     'nadir': fromJulian(jNoon - 0.5)
//   };

//   for (var time in times) {
//     double h0 = (time[0] + dh) * _rad;
//     double jSet = getSetJ(h0, lw, phi, dec, n, M, L);
//     double jRise = jNoon - (jSet - jNoon);

//     result[time[1]] = fromJulian(jRise);
//     result[time[2]] = fromJulian(jSet);
//   }

//   return result;
// }

// // moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas
// ({double rightAscension, double declination, double dist}) moonCoords(
//     double d) {
//   double L = _rad * (218.316 + 13.176396 * d);
//   double M = _rad * (134.963 + 13.064993 * d);
//   double F = _rad * (93.272 + 13.229350 * d);

//   double l = L + _rad * 6.289 * _sin(M);
//   double b = _rad * 5.128 * _sin(F);
//   double dt = 385001 - 20905 * _cos(M);

//   return (
//     rightAscension: rightAscension(l, b),
//     declination: declination(l, b),
//     dist: dt,
//   );
// }

// Map<String, double> getMoonPosition(DateTime date, double lat, double lng) {
//   double lw = _rad * -lng;
//   double phi = _rad * lat;
//   double d = toDays(date);

//   var c = moonCoords(d);
//   double H = siderealTime(d, lw) - c.rightAscension;
//   double h = altitude(H, phi, c['declination']);
//   double pa = _atan2(
//       _sin(H), _tan(phi) * _cos(c['declination']) - _sin(c['dec']) * _cos(H));

//   h = h + astroRefraction(h);

//   return {
//     'azimuth': azimuth(H, phi, c['declination']),
//     'altitude': h,
//     'distance': c['dist'],
//     'parallacticAngle': pa
//   };
// }

// // calculations for illumination parameters of the moon
// Map<String, double> getMoonIllumination([DateTime date]) {
//   double d = toDays(date ?? DateTime.now());
//   var s = sunCoords(d);
//   var m = moonCoords(d);

//   double sdist = 149598000;

//   double phi = _acos(_sin(s['declination']) * _sin(m['dec']) +
//       _cos(s['declination']) *
//           _cos(m['dec']) *
//           _cos(s['rightAscension'] - m['rightAscension']));
//   double inc = _atan2(sdist * _sin(phi), m['dist'] - sdist * _cos(phi));
//   double angle = _atan2(
//       _cos(s['declination']) * _sin(s['rightAscension'] - m['rightAscension']),
//       _sin(s['declination']) * _cos(m['dec']) -
//           _cos(s['declination']) *
//               _sin(m['dec']) *
//               _cos(s['rightAscension'] - m['rightAscension']));

//   return {
//     'fraction': (1 + _cos(inc)) / 2,
//     'phase': 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / _pi,
//     'angle': angle
//   };
// }

// DateTime hoursLater(DateTime date, double h) =>
//     date.add(Duration(milliseconds: (h * dayMs / 24).toInt()));

// // calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
// Map<String, dynamic> getMoonTimes(DateTime date, double lat, double lng,
//     [bool inUTC = false]) {
//   DateTime t = DateTime(date.year, date.month, date.day);
//   if (inUTC) t = t.toUtc();

//   double hc = 0.133 * _rad;
//   double h0 = getMoonPosition(t, lat, lng)['altitude'] - hc;
//   double h1, h2, rise, set, a, b, xe, ye, d, roots, x1, x2, dx;

//   for (int i = 1; i <= 24; i += 2) {
//     h1 =
//         getMoonPosition(hoursLater(t, i.toDouble()), lat, lng)['altitude'] - hc;
//     h2 = getMoonPosition(
//             hoursLater(t, (i + 1).toDouble()), lat, lng)['altitude'] -
//         hc;

//     a = (h0 + h2) / 2 - h1;
//     b = (h2 - h0) / 2;
//     xe = -b / (2 * a);
//     ye = (a * xe + b) * xe + h1;
//     d = b * b - 4 * a * h1;
//     roots = 0;

//     if (d >= 0) {
//       dx = sqrt(d) / (a.abs() * 2);
//       x1 = xe - dx;
//       x2 = xe + dx;
//       if (x1.abs() <= 1) roots++;
//       if (x2.abs() <= 1) roots++;
//       if (x1 < -1) x1 = x2;
//     }

//     if (roots == 1) {
//       if (h0 < 0)
//         rise = i + x1;
//       else
//         set = i + x1;
//     } else if (roots == 2) {
//       rise = i + (ye < 0 ? x2 : x1);
//       set = i + (ye < 0 ? x1 : x2);
//     }

//     if (rise != null && set != null) break;

//     h0 = h2;
//   }

//   Map<String, dynamic> result = {};

//   if (rise != null) result['rise'] = hoursLater(t, rise);
//   if (set != null) result['set'] = hoursLater(t, set);

//   if (rise == null && set == null)
//     result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;

//   return result;
// }
