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
        topogons: topogons.map((e) => Topogon.fromJson(e)).toList(),
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
