import 'types.dart';

class Timestamps {
  final DateTime createdAt;
  final DateTime updatedAt;

  const Timestamps({
    required this.createdAt,
    required this.updatedAt,
  });

  factory Timestamps.fromJson(JsonObject json) {
    if (json
        case {
          'createdAt': String createdAt,
          'updatedAt': String updatedAt,
        }) {
      return Timestamps(
        createdAt: DateTime.parse(createdAt),
        updatedAt: DateTime.parse(updatedAt),
      );
    }
    throw JSONException("Timestamps", json);
  }

  JsonObject toJson() {
    return {
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
