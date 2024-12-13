import 'package:flutter_map/flutter_map.dart';

import 'coordinate.dart';
import 'types.dart';

class Bounds {
  final Coordinate topLeft;
  final Coordinate bottomRight;

  const Bounds({
    required this.topLeft,
    required this.bottomRight,
  });

  factory Bounds.fromJson(JsonObject json) {
    if (json
        case {
          'topLeft': JsonObject topLeft,
          'bottomRight': JsonObject bottomRight
        }) {
      return Bounds(
        topLeft: Coordinate.fromJson(topLeft),
        bottomRight: Coordinate.fromJson(bottomRight),
      );
    }
    throw JSONException("Bounds", json);
  }

  JsonObject toJson() {
    return {
      'topLeft': topLeft.toJson(),
      'bottomRight': bottomRight.toJson(),
    };
  }

  Coordinate get center {
    return Coordinate(
      lat: (topLeft.lat + bottomRight.lat) / 2,
      lng: (topLeft.lng + bottomRight.lng) / 2,
    );
  }

  LatLngBounds get toLatLngBounds {
    return LatLngBounds(
      topLeft.toLatLng,
      bottomRight.toLatLng,
    );
  }
}
