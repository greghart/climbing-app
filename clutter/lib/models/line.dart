import 'coordinate.dart';
import 'types.dart';

class Line {
  final int id;
  final Coordinate start;
  final Coordinate end;

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
        start: Coordinate.fromJson(start),
        end: Coordinate.fromJson(end),
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
