// @see {https://aa.quae.nl/en/reken/zonpositie.html#1}
// JD starts at 12:00 UTC, so 00:00 ~ 0.5
typedef JulianDay = double;

// date/time constants and conversions
const int dayMs = 1000 * 60 * 60 * 24;
const double j1970 = 2440588;
const double j2000 = 2451545;

double toJulian(DateTime date) =>
    date.millisecondsSinceEpoch / dayMs - 0.5 + j1970;
JulianDay toDays(DateTime date) => toJulian(date);
