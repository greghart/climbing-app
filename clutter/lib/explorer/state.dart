import 'package:flutter/material.dart';

import '../models/index.dart' as models;

// ExplorerState handles the internal routing and state management for the explorer pages.
// Routing just sets up the initial state to support deep linking, but once explorer is open,
// we need to maintain widgets to keep map from flickering.
//
// It is expected that this class will ensure entityId will always reflect an actual entity of entityType
class ExplorerState extends ChangeNotifier {
  ExplorerState({
    required this.crag,
    required this.entityType,
    this.entityId,
  }) {
    areasById = {};
    bouldersById = {};
    routesById = {};

    for (var area in crag.areas) {
      areasById[area.id.toString()] = area;
      for (var boulder in area.boulders) {
        bouldersById[boulder.id.toString()] = boulder;
        for (var route in boulder.routes) {
          routesById[route.id.toString()] = route;
        }
      }
    }
  }

  late final Map<String, models.Area> areasById;
  late final Map<String, models.Boulder> bouldersById;
  late final Map<String, models.Route> routesById;

  models.Crag crag;
  EntityType entityType;
  int? entityId;

  models.Area? get area {
    if (entityType == EntityType.area) {
      return areasById[entityId.toString()];
    }
    return boulder != null ? areasById[boulder!.areaId.toString()] : null;
  }

  models.Boulder? get boulder {
    if (entityType == EntityType.boulder) {
      return bouldersById[entityId.toString()];
    }
    return route != null ? bouldersById[route!.boulderId.toString()] : null;
  }

  models.Route? get route {
    if (entityType != EntityType.route) {
      return null;
    }
    return routesById[entityId.toString()];
  }

  void setCrag() {
    entityType = EntityType.crag;
    entityId = null;
    notifyListeners();
  }

  void setArea(int id) {
    entityType = EntityType.area;
    entityId = id;
    if (area == null) {
      throw ArgumentError('Area not found');
    }
    notifyListeners();
  }

  void setBoulder(int id) {
    entityType = EntityType.boulder;
    entityId = id;
    if (boulder == null) {
      throw ArgumentError('Boulder not found');
    }
    notifyListeners();
  }

  void setRoute(int id) {
    entityType = EntityType.route;
    entityId = id;
    if (route == null) {
      throw ArgumentError('Route not found');
    }
    notifyListeners();
  }

  // Just for tracking position
  double sheetPosition = 0.2;
  void setSheetPosition(double v) {
    sheetPosition = v;
    notifyListeners();
  }
}

enum EntityType { crag, area, boulder, route }
