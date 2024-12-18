import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../models/area.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class AreaMap extends StatelessWidget {
  const AreaMap({super.key, required this.area});

  final Area area;

  @override
  Widget build(BuildContext context) {
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
        if (area.polygon != null) ...[
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: area.polygon!.toLatLngs,
              ),
            ],
          )
        ],
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
