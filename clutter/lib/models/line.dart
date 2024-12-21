import 'coordinate.dart';
import 'types.dart';

class Line {
  final int id;
  final LatLng start;
  final LatLng end;

  const Line({
    required this.id,
    required this.start,
    required this.end,
  });

  factory Line.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'start': JsonObject start,
          'end': JsonObject end,
        }) {
      return Line(
        id: id,
        start: jsonLatLng(start),
        end: jsonLatLng(end),
      );
    }
    throw JSONException("Line", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'start': start.toJson(),
      'end': end.toJson(),
    };
  }
}
