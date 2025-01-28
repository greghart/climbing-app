import 'dart:convert' as convert;

import 'topogon_data.dart';
import 'types.dart';

class Topogon {
  final int id;
  final String label;
  final TopogonData data;
  final int? areaId;
  final int? boulderId;
  final int? routeId;

  const Topogon({
    required this.id,
    required this.label,
    required this.data,
    this.areaId,
    this.boulderId,
    this.routeId,
  });

  factory Topogon.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'label': String label,
          'data': String data,
          'areaId': int? areaId,
          'boulderId': int? boulderId,
          'routeId': int? routeId,
        }) {
      return Topogon(
        id: id,
        label: label,
        data: TopogonData.fromJson(convert.jsonDecode(data)),
        areaId: areaId,
        boulderId: boulderId,
        routeId: routeId,
      );
    }
    throw JSONException("Topogon", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'label': label,
      'data': convert.jsonEncode(data.toJson()),
      'areaId': areaId,
      'boulderId': boulderId,
      'routeId': routeId,
    };
  }
}
