import 'dart:math';

import 'package:flutter/foundation.dart';
import '../models/grade.dart';
import '../models/index.dart' as models;
import '../util/debounce.dart';

class SearchModel extends ChangeNotifier {
  SearchModel({
    required this.crag,
  }) {
    all = [
      for (final area in crag.areas) ...[
        SearchEntity(type: SearchType.area, id: area.id, name: area.name),
        for (final boulder in area.boulders) ...[
          SearchEntity(
              type: SearchType.boulder, id: boulder.id, name: boulder.name),
          for (final route in boulder.routes)
            SearchEntity(
              type: SearchType.route,
              id: route.id,
              name: route.name,
              grade: route.grade,
            ),
        ],
      ],
    ];
    results = all.sublist(0, min(10, all.length));
  }

  final models.Crag crag;
  late final List<SearchEntity> all;

  // Filter on type of entity
  SearchType type = SearchType.any;
  // Filter on search/name match, case insensitive
  String search = '';
  List<SearchEntity> results = [];
  bool isLoading = false;

  void setType(SearchType value) {
    if (type != value) {
      type = value;
      updateSearchResults();
    }
  }

  void setSearch(String value) {
    if (search != value) {
      search = value;
      updateSearchResults();
    }
  }

  final _debounceSearch = Debouncer(milliseconds: 250);

  void updateSearchResults() async {
    isLoading = true;
    notifyListeners();

    _debounceSearch.run(() async {
      results = await compute(_search, (all: all, type: type, search: search));
      isLoading = false;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _debounceSearch.dispose();
    super.dispose();
  }
}

/// Search logic
class SearchEntity {
  SearchEntity({
    required this.type,
    required this.id,
    required this.name,
    this.grade,
  }) : _lowercase = name.toLowerCase();

  final SearchType type;
  final int id;
  final String name;
  late final String _lowercase;
  final Grade? grade;
}

enum SearchType { any, area, boulder, route }

extension Display on SearchType {
  String display() {
    return '${name[0].toUpperCase()}${name.substring(1)}';
  }
}

typedef SearchPayload = ({
  List<SearchEntity> all,
  SearchType type,
  String search
});

List<SearchEntity> _search(SearchPayload payload) {
  final matchType = _typeMatcher(payload.type);
  final matchSearch = _searchMatcher(payload.search.toLowerCase());
  return payload.all.where((e) => matchType(e) && matchSearch(e)).toList();
}

typedef Matcher = bool Function(SearchEntity entity);
Matcher _searchMatcher(String search) {
  if (search == "") return (e) => true;
  return (e) => e._lowercase.contains(search);
}

Matcher _typeMatcher(SearchType type) {
  if (type == SearchType.any) return (e) => true;
  return (e) => e.type == type;
}
