import 'package:collection/collection.dart';

import 'topogon.dart';
import 'types.dart';

class Topo {
  final int id;
  final String title;
  final List<Topogon> topogons;
  final double scale;

  const Topo({
    required this.id,
    required this.title,
    required this.topogons,
    required this.scale,
  });

  factory Topo.fromJson(JsonObject json) {
    if (json
        case {
          'id': int id,
          'title': String title,
          'topogons': List topogons,
          'scale': double scale,
        }) {
      return Topo(
        id: id,
        title: title,
        // Try and sort topogons left to right to make them easier to be consistent with
        topogons: topogons
            .map((e) => Topogon.fromJson(e))
            .sorted((a, b) => a.data.lines[0].points[0].x
                .compareTo(b.data.lines[0].points[0].x))
            .toList(),
        scale: scale,
      );
    }
    throw JSONException("Topo", json);
  }

  JsonObject toJson() {
    return {
      'id': id,
      'title': title,
      'topogons': topogons.map((t) => t.toJson()).toList(),
      'scale': scale,
    };
  }
}
