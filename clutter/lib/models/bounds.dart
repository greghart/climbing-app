import 'package:flutter_map/flutter_map.dart';

import 'coordinate.dart';
import 'types.dart';

class Bounds {
  final LatLng topLeft;
  final LatLng bottomRight;

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
        topLeft: jsonLatLng(topLeft),
        bottomRight: jsonLatLng(bottomRight),
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

  LatLng get center {
    return LatLng(
      (topLeft.latitude + bottomRight.latitude) / 2,
      (topLeft.longitude + bottomRight.longitude) / 2,
    );
  }

  LatLngBounds get toLatLngBounds {
    return LatLngBounds(
      topLeft,
      bottomRight,
    );
  }
}
