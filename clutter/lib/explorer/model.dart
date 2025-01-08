import 'dart:async';
import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import '../models/index.dart' as models;

enum EntityType { crag, area, boulder, route }

// ExplorerState handles the internal routing and state management for the explorer pages.
// Routing just sets up the initial state to support deep linking, but once explorer is open,
// we need to maintain widgets to keep map from flickering.
//
// It is expected that this class will ensure entityId will always reflect an actual entity of entityType
class ExplorerModel extends ChangeNotifier {
  ExplorerModel({
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
}

class ExplorerSheetModel extends ChangeNotifier {
  // Just for tracking position
  double sheetPosition = 0.2;
  void setSheetPosition(double v) {
    sheetPosition = v;
    notifyListeners();
  }
}

enum LayerType { areas, boulders, routes, trails }

extension Display on LayerType {
  String display() {
    return '${name[0].toUpperCase()}${name.substring(1)}';
  }
}

// ExplorerLayersModel manages UI state for selected map layers
class ExplorerLayersModel extends ChangeNotifier {
  final Map<LayerType, bool> layers = {
    LayerType.areas: true,
    LayerType.boulders: true,
    LayerType.routes: true,
    LayerType.trails: true,
  };

  bool isChecked(LayerType type) {
    return layers[type]!;
  }

  toggleLayer(LayerType type) {
    if (!layers.containsKey(type)) {
      throw ArgumentError('Invalid layer type');
    }
    layers[type] = !layers[type]!;
    notifyListeners();
  }
}

// ExplorerLocationModel manages the location and heading for the explorer map.
// Uses StreamControllers to let us take in both real events and simulated user events on desktop.
// Only listens to real data when there are listeners.
// Also manages current position as heading as app state when streams are obtuse.
class ExplorerLocationModel extends ChangeNotifier {
  late final StreamController<LocationMarkerPosition?> positionStream;
  late final StreamController<LocationMarkerHeading?> headingStream;
  StreamSubscription<LocationMarkerPosition?>? actualPositions;
  StreamSubscription<LocationMarkerHeading?>? actualHeadings;
  // Persist latest state so we can simulate user movement
  late LocationMarkerPosition currentPosition;
  late LocationMarkerHeading currentHeading;

  ExplorerLocationModel(models.Crag crag) {
    positionStream = StreamController.broadcast(onListen: () {
      actualPositions != null
          ? actualPositions!.resume()
          : _setLatLng(crag.center.latitude, crag.center.longitude,
              notify: false);
    }, onCancel: () {
      actualPositions?.pause();
    });
    headingStream = StreamController.broadcast(onListen: () {
      actualHeadings != null
          ? actualHeadings!.resume()
          : _setHeading(0, notify: false);
    }, onCancel: () {
      actualHeadings?.pause();
    });

    if (Platform.isAndroid || Platform.isIOS) {
      const factory = LocationMarkerDataStreamFactory();
      actualPositions = factory
          .fromGeolocatorPositionStream()
          .asBroadcastStream()
          .listen((event) {
        setPosition(event);
      });
      actualHeadings = factory
          .fromCompassHeadingStream()
          .asBroadcastStream()
          .listen((event) {
        setHeading(event);
      });
    }
  }

  void setPosition(LocationMarkerPosition? position, {notify = true}) {
    if (position == null) return;

    currentPosition = position;
    positionStream.add(position);
    if (notify) notifyListeners();
  }

  void setHeading(LocationMarkerHeading? heading, {notify = true}) {
    if (heading == null) return;

    currentHeading = heading;
    headingStream.add(heading);
    if (notify) notifyListeners();
  }

  // Simulate user movement
  void rotateLeft() {
    _setHeading(
      currentHeading.heading - math.pi / 8,
    );
  }

  void rotateRight() {
    _setHeading(
      currentHeading.heading + math.pi / 8,
    );
  }

  void up() {
    _setLatLng(
      currentPosition.latitude + 0.0001,
      currentPosition.longitude,
    );
  }

  void down() {
    _setLatLng(
      currentPosition.latitude - 0.0001,
      currentPosition.longitude,
    );
  }

  void left() {
    _setLatLng(
      currentPosition.latitude,
      currentPosition.longitude - 0.0001,
    );
  }

  void right() {
    _setLatLng(
      currentPosition.latitude,
      currentPosition.longitude + 0.0001,
    );
  }

  void _setHeading(double heading, {notify = true}) {
    setHeading(
      LocationMarkerHeading(
        heading: normalizeRads(heading),
        accuracy: math.pi * 0.2,
      ),
      notify: notify,
    );
  }

  void _setLatLng(double lat, double lng, {notify = true}) {
    setPosition(
      LocationMarkerPosition(
        latitude: lat,
        longitude: lng,
        accuracy: 0,
      ),
      notify: notify,
    );
  }

  @override
  dispose() {
    super.dispose();
    positionStream.close();
    headingStream.close();
    actualPositions?.cancel();
    actualHeadings?.cancel();
  }
}

// Normalize rads to [0, 2*pi]
double normalizeRads(double r) {
  return r % (2 * math.pi);
}
