import 'types.dart';

enum GradingSystemType implements Comparable<GradingSystemType> {
  vScale('V'),
  yds('YDS');

  const GradingSystemType(this.value);
  final String value;

  factory GradingSystemType.fromJson(String value) {
    switch (value) {
      case "V":
        return GradingSystemType.vScale;
      case "YDS":
        return GradingSystemType.yds;
      default:
        throw JSONException("GradingSystemType", value);
    }
  }

  @override
  int compareTo(GradingSystemType other) => value.compareTo(other.value);
}

class Grade {
  final GradingSystemType system;
  final String raw;
  final int value;

  const Grade({
    required this.system,
    required this.raw,
    required this.value,
  });

  String display() {
    return '${system.value} $raw';
  }

  factory Grade.fromJson(JsonObject json) {
    if (json
        case {
          'system': String system,
          'raw': String raw,
          'value': int value,
        }) {
      return Grade(
        system: GradingSystemType.fromJson(system),
        raw: raw,
        value: value,
      );
    }
    throw JSONException("Grade", json);
  }

  JsonObject toJson() {
    return {
      'system': system.toString().split('.').last,
      'raw': raw,
      'value': value,
    };
  }
}
