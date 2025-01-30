import 'dart:convert' as convert;

import 'entities/crag.dart';

/// TODO: For now, this Data class is very dumb and just parses a json string into a crag
/// Long term, we will want to fetch this data from a server, allow re-syncing it, etc.
class Data {
  Data(String data) {
    crag = Crag.fromJson(convert.jsonDecode(data));
  }

  late final Crag crag;
}
