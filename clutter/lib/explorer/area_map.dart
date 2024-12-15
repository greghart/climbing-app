import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

import '../models/area.dart';

typedef HitValue = ({int id});

class AreaMap extends StatelessWidget {
  const AreaMap({super.key});

  @override
  Widget build(BuildContext context) {
    final area = context.watch<Area>();
    final theme = Theme.of(context);
    return Stack(
      children: [
        MarkerLayer(
          markers: area.boulders.map((b) {
            return Marker(
              point: b.coordinates.toLatLng,
              // TODO: Bring in boulder icon
              child: Icon(Icons.location_pin,
                  size: 60, color: theme.colorScheme.tertiary),
            );
          }).toList(),
        ),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: LatLng(
            area.polygon!.coordinates.map((c) => c.lat).average,
            area.polygon!.coordinates.map((c) => c.lng).average,
          ),
          zoom: 18,
        ),
      ],
    );
  }
}

class AnimateTo extends StatefulWidget {
  const AnimateTo(
      {super.key,
      required this.latLng,
      required this.zoom,
      required this.mapController});

  final MapController mapController;
  final LatLng latLng;
  final double zoom;

  @override
  State<AnimateTo> createState() => _AnimateToState();
}

class _AnimateToState extends State<AnimateTo> with TickerProviderStateMixin {
  static const _startedId = 'AnimatedMapController#MoveStarted';
  static const _inProgressId = 'AnimatedMapController#MoveInProgress';
  static const _finishedId = 'AnimatedMapController#MoveFinished';

  @override
  initState() {
    super.initState();
    _animatedMapMove(
      widget.mapController,
      widget.latLng,
      widget.zoom,
    );
  }

  @override
  Widget build(BuildContext context) {
    // Ran for side effect
    return const SizedBox.shrink();
  }

  void _animatedMapMove(
      MapController mapController, LatLng destLocation, double destZoom) {
    // Create some tweens. These serve to split up the transition from one location to another.
    // In our case, we want to split the transition be<tween> our current map center and the destination.
    final camera = mapController.camera;
    final latTween = Tween<double>(
        begin: camera.center.latitude, end: destLocation.latitude);
    final lngTween = Tween<double>(
        begin: camera.center.longitude, end: destLocation.longitude);
    final zoomTween = Tween<double>(begin: camera.zoom, end: destZoom);

    // Create a animation controller that has a duration and a TickerProvider.
    final controller = AnimationController(
        duration: const Duration(milliseconds: 500), vsync: this);
    // The animation determines what path the animation will take. You can try different Curves values, although I found
    // fastOutSlowIn to be my favorite.
    final Animation<double> animation =
        CurvedAnimation(parent: controller, curve: Curves.fastOutSlowIn);

    // Note this method of encoding the target destination is a workaround.
    // When proper animated movement is supported (see #1263) we should be able
    // to detect an appropriate animated movement event which contains the
    // target zoom/center.
    final startIdWithTarget =
        '$_startedId#${destLocation.latitude},${destLocation.longitude},$destZoom';
    bool hasTriggeredMove = false;

    controller.addListener(() {
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

    animation.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        controller.dispose();
      } else if (status == AnimationStatus.dismissed) {
        controller.dispose();
      }
    });

    controller.forward();
  }
}
