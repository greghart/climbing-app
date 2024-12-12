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
}
