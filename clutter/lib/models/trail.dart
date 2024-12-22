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

  List<List<LatLng>> get toPolylines {
    var polylines = <List<LatLng>>[];
    var pending = <LatLng>[lines.first.start, lines.first.end];
    for (final line in lines.sublist(1)) {
      // If not linear in setup (which is allowed), pivot to a new polyline
      if (pending[pending.length - 1] != line.start) {
        polylines.add(pending);
        pending = [line.start];
      }
      pending.add(line.end);
    }
    return polylines;
  }
}
