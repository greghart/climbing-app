import 'package:collection/collection.dart';
import 'coordinate.dart';
import 'types.dart';

class Polygon {
  final int id;
  final String? descriptor;
  final List<LatLng> coordinates;

  const Polygon({
    required this.id,
    this.descriptor,
    required this.coordinates,
  });

  factory Polygon.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'descriptor': String? descriptor,
          'coordinates': List coordinates,
        }) {
      return Polygon(
        id: id,
        descriptor: descriptor,
        coordinates: coordinates.map((coord) => jsonLatLng(coord)).toList(),
      );
    }
    throw JSONException("Polygon", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'descriptor': descriptor,
      'coordinates': coordinates.map((coord) => coord.toJson()).toList(),
    };
  }

  LatLng get center => LatLng(
        coordinates.map((c) => c.latitude).average,
        coordinates.map((c) => c.longitude).average,
      );
}
