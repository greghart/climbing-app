import 'types.dart';

class Coordinate {
  final double lat;
  final double lng;

  const Coordinate({
    required this.lat,
    required this.lng,
  });

  factory Coordinate.fromJson(JsonObject json) {
    if (json case {'lat': double lat, 'lng': double lng}) {
      return Coordinate(
        lat: lat,
        lng: lng,
      );
    }
    throw JSONException("Coordinate", json);
  }

  @override
  bool operator ==(Object other) =>
      (other is Coordinate) ? (lat == other.lat && lng == other.lng) : false;

  @override
  int get hashCode => Object.hash(lat, lng);

  JsonObject toJson() {
    return {
      'lat': lat,
      'lng': lng,
    };
  }
}
