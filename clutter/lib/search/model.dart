import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../entities/grade.dart';
import '../entities/index.dart' as entities;
import '../util/debounce.dart';
import '../util/sun.dart';
import '../util/suncalc.dart' as suncalc;

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
    _sunValues = SunValuesModel(crag: crag);
  }

  final entities.Crag crag;
  late final List<SearchEntity> all;
  late final SunValuesModel _sunValues;

  // Calculated results list
  List<SearchEntity> results = [];
  // Async calculating...
  bool isLoading = false;

  // Filter on type of entity
  SearchType type = SearchType.any;
  void setType(SearchType value) {
    if (type != value) {
      type = value;
      updateSearchResults();
    }
  }

  // Filter on route difficulty
  RangeValues gradeRange = const RangeValues(0, 180);
  RangeLabels gradeLabels = const RangeLabels("VB", "V18");
  void setGradeRange(RangeValues values) {
    if (gradeRange != values) {
      gradeRange = values;
      gradeLabels = RangeLabels(
        displayGradeValue(values.start),
        displayGradeValue(values.end),
      );
      updateSearchResults();
    }
  }

  String _displayHourValue(double value) {
    if (value == 12) return 'Noon';

    return "${(value % 12).round()}${value > 12 ? 'PM' : 'AM'}";
  }

  // Filter on shade, or shade at time
  bool shady = false;
  void setShady(bool? value) {
    if (value != null && shady != value) {
      shady = value;
      updateSearchResults();
    }
  }

  double shadyAt = 6;
  String shadyAtLabel = 'Noon';
  void setShadyAt(value) {
    if (shadyAt != value) {
      shadyAt = value;
      shadyAtLabel = _displayHourValue(value);
      updateSearchResults();
    }
  }

  // Filter on search/name match, case insensitive
  String search = '';
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
      results = await compute(_search, (
        all: all,
        type: type,
        search: search,
        gradeRange: gradeRange,
        shady: shady,
        shadyAt: shadyAt,
        sunValues: _sunValues.routesById,
      ));
      isLoading = false;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _debounceSearch.dispose();
    _sunValues.dispose();
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
  String search,
  RangeValues gradeRange,
  bool shady,
  double shadyAt,
  Map<String, double> sunValues,
});

List<SearchEntity> _search(SearchPayload payload) {
  final matchType = _typeMatcher(payload.type);
  final matchSearch = _searchMatcher(payload.search.toLowerCase());
  final matchDifficulty = _difficultyMatcher(payload.gradeRange);
  final matchShade =
      _shadeMatcher(payload.shady, payload.shadyAt, payload.sunValues);
  return payload.all
      .where((e) =>
          matchType(e) && matchSearch(e) && matchDifficulty(e) && matchShade(e))
      .toList();
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

Matcher _difficultyMatcher(RangeValues range) {
  return (e) {
    if (e.type != SearchType.route) return true;
    if (e.grade == null) return true;
    return e.grade!.value >= range.start && e.grade!.value <= range.end;
  };
}

Matcher _shadeMatcher(bool shady, double hour, Map<String, double> sunValues) {
  if (!shady) return (e) => true;

  return (e) {
    if (e.type != SearchType.route) return false;
    if (sunValues[e.id.toString()] == null) return false;

    // Totally arbitrary
    return sunValues[e.id.toString()]! < 0.6;
  };
}

const sunExpiry = Duration(minutes: 30);

// Caches sun positions and values for given crag.
class SunValuesModel extends ChangeNotifier {
  final entities.Crag crag;
  // General position of sun for this crag
  // TODO: Technically more accurate to calculate for each entity individually, necessary for larger crags covering more space.
  late final suncalc.SunPosition sunPosition;
  // Sun value for each route
  late final Map<String, double> routesById;
  late final Timer timer;

  SunValuesModel({
    required this.crag,
  }) {
    refresh();
    timer = Timer.periodic(sunExpiry, (timer) {
      refresh();
    });
  }

  @override
  dispose() {
    super.dispose();
    timer.cancel();
  }

  void refresh() {
    final now = DateTime.now();
    routesById = {};
    sunPosition = suncalc.getPosition(
      time: now,
      lat: crag.center.latitude,
      lng: crag.center.longitude,
    );

    for (var area in crag.areas) {
      for (var boulder in area.boulders) {
        for (var route in boulder.routes) {
          if (route.coordinates == null) continue;
          routesById[route.id.toString()] = getSunValue(
            inputVector: (
              route.coordinates!.latitude - boulder.coordinates.latitude,
              route.coordinates!.longitude - boulder.coordinates.longitude,
            ),
            sunPosition: suncalc.getPosition(
              time: now,
              lat: route.coordinates!.latitude,
              lng: route.coordinates!.longitude,
            ),
          );
        }
      }
    }
    notifyListeners();
  }
}
