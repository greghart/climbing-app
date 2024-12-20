import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'line.dart';
import 'types.dart';

class Trail {
  final int id;
  final List<Line> lines;

  const Trail({
    required this.id,
    required this.lines,
  });

  factory Trail.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'lines': List lines,
        }) {
      return Trail(
        id: id,
        lines: lines.map((line) => Line.fromJson(line)).toList(),
      );
    }
    throw JSONException("Trail", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'lines': lines.map((line) => line.toJson()).toList(),
    };
  }

  List<Polyline<Object>> get toPolylines {
    var polylines = <Polyline>[];
    var pending = <LatLng>[
      lines.first.start.toLatLng,
      lines.first.end.toLatLng
    ];
    for (final line in lines.sublist(1)) {
      // If not linear in setup (which is allowed), pivot to a new polyline
      if (pending[pending.length - 1] != line.start.toLatLng) {
        polylines.add(Polyline(points: pending));
        pending = [line.start.toLatLng];
      }
      pending.add(line.end.toLatLng);
    }
    return polylines;
  }
}
