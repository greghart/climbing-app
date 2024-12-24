import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';

import '../models/crag.dart';

/// A widget that displays the current location of the user on a map.
/// For now it simulates the streams
class CurrentLocation extends StatefulWidget {
  const CurrentLocation({
    super.key,
    required this.crag,
  });
  final Crag crag;

  @override
  State<CurrentLocation> createState() => _CurrentLocationState();
}

class _CurrentLocationState extends State<CurrentLocation> {
  late final StreamController<LocationMarkerPosition> _positionStreamController;
  late final StreamController<LocationMarkerHeading> _headingStreamController;
  double _currentLat = 0;
  double _currentLng = 0;
  double _heading = 0;

  @override
  void initState() {
    super.initState();
    _positionStreamController = StreamController();
    setLatLng(widget.crag.center.latitude, widget.crag.center.longitude);
    _headingStreamController = StreamController();
    setHeading(0);
  }

  void setLatLng(double lat, double lng) {
    _currentLat = lat;
    _currentLng = lng;
    _positionStreamController.add(
      LocationMarkerPosition(
        latitude: _currentLat,
        longitude: _currentLng,
        accuracy: 0,
      ),
    );
  }

  void setHeading(double heading) {
    _heading = heading;
    _headingStreamController
        .add(LocationMarkerHeading(heading: _heading, accuracy: pi * 0.2));
  }

  @override
  void dispose() {
    _positionStreamController.close();
    _headingStreamController.close();
    super.dispose();
  }

  @override
  build(BuildContext context) {
    return CallbackShortcuts(
      bindings: <ShortcutActivator, VoidCallback>{
        const SingleActivator(LogicalKeyboardKey.keyQ): () {
          setHeading(_heading - pi / 8);
        },
        const SingleActivator(LogicalKeyboardKey.keyE): () {
          setHeading(_heading + pi / 8);
        },
        const SingleActivator(LogicalKeyboardKey.keyW): () {
          setLatLng(_currentLat + 0.0001, _currentLng);
        },
        const SingleActivator(LogicalKeyboardKey.keyS): () {
          setLatLng(_currentLat - 0.0001, _currentLng);
        },
        const SingleActivator(LogicalKeyboardKey.keyA): () {
          setLatLng(_currentLat, _currentLng - 0.0001);
        },
        const SingleActivator(LogicalKeyboardKey.keyD): () {
          setLatLng(_currentLat, _currentLng + 0.0001);
        },
      },
      child: Focus(
        autofocus: true,
        child: CurrentLocationLayer(
          positionStream: _positionStreamController.stream,
          headingStream: _headingStreamController.stream,
        ),
      ),
    );
  }
}
