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
  final double value;

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
        }) {
      double value = 0;
      if (json case {'value': int v}) {
        value = v.toDouble();
      } else if (json case {'value': double v}) {
        value = v;
      }
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

/// For now just have a super dumb conversion of grade value to v-scale string
/// TODO: Implement full grades lib in dart?
String displayGradeValue(double value) {
  if (value == 0) return "VB";

  return "V${(value / 10).round().toString()}";
}

const vGrades = [
  'VB',
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];
