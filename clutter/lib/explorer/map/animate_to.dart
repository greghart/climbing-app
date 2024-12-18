import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class AnimateTo extends StatefulWidget {
  const AnimateTo({
    super.key,
    required this.latLng,
    required this.zoom,
    required this.mapController,
    this.offset,
  });

  final MapController mapController;
  final LatLng latLng;
  final double zoom;
  final Offset? offset;

  @override
  State<AnimateTo> createState() => _AnimateToState();
}

class _AnimateToState extends State<AnimateTo> with TickerProviderStateMixin {
  static const _startedId = 'AnimatedMapController#MoveStarted';
  static const _inProgressId = 'AnimatedMapController#MoveInProgress';
  static const _finishedId = 'AnimatedMapController#MoveFinished';
  var _once = false;

  AnimationController? _animationController;

  @override
  Widget build(BuildContext context) {
    // Ran for side effect
    if (!_once) {
      _animatedMapMove(
        widget.mapController,
        widget.latLng,
        widget.zoom,
        // we usually want the offset to result in items being just under the search bar
        widget.offset ??
            Offset(0, -(MediaQuery.sizeOf(context).height / 2 - 150)),
      );
    }
    _once = true;
    return const SizedBox.shrink();
  }

  @override
  dispose() {
    _animationController?.dispose();
    super.dispose();
  }

  void _animatedMapMove(MapController mapController, LatLng destLocation,
      double destZoom, Offset offset) {
    // Create some tweens. These serve to split up the transition from one location to another.
    // In our case, we want to split the transition be<tween> our current map center and the destination.
    final camera = mapController.camera;
    // Handle offset here since the tweens need to know about it
    if (offset != Offset.zero) {
      final newPoint = camera.project(destLocation, destZoom);
      destLocation = camera.unproject(
        camera.rotatePoint(
          newPoint,
          newPoint - Point(offset.dx, offset.dy),
        ),
        destZoom,
      );
    }
    final latTween = Tween<double>(
        begin: camera.center.latitude, end: destLocation.latitude);
    final lngTween = Tween<double>(
        begin: camera.center.longitude, end: destLocation.longitude);
    final zoomTween = Tween<double>(begin: camera.zoom, end: destZoom);

    // Create a animation controller that has a duration and a TickerProvider.
    _animationController = AnimationController(
        duration: const Duration(milliseconds: 500), vsync: this);
    // The animation determines what path the animation will take. You can try different Curves values, although I found
    // fastOutSlowIn to be my favorite.
    final Animation<double> animation = CurvedAnimation(
        parent: _animationController!, curve: Curves.fastOutSlowIn);

    // Note this method of encoding the target destination is a workaround.
    // When proper animated movement is supported (see #1263) we should be able
    // to detect an appropriate animated movement event which contains the
    // target zoom/center.
    final startIdWithTarget =
        '$_startedId#${destLocation.latitude},${destLocation.longitude},$destZoom';
    bool hasTriggeredMove = false;

    _animationController!.addListener(() {
      final String id;
      if (animation.value == 1.0) {
        id = _finishedId;
      } else if (!hasTriggeredMove) {
        id = startIdWithTarget;
      } else {
        id = _inProgressId;
      }

      hasTriggeredMove |= mapController.move(
        LatLng(latTween.evaluate(animation), lngTween.evaluate(animation)),
        zoomTween.evaluate(animation),
        id: id,
      );
    });

    _animationController!.forward();
  }
}
