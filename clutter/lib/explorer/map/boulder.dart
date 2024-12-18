import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';

import '../../models/boulder.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class BoulderMap extends StatelessWidget {
  const BoulderMap({super.key, required this.boulder});

  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Stack(
      children: [
        MarkerLayer(
          // TODO: Clustering around boulder
          markers: boulder.routes.where((r) => r.coordinates != null).map((r) {
            return Marker(
              point: r.coordinates!.toLatLng,
              // TODO: Bring in route icon
              child: Icon(Icons.location_pin,
                  size: 20, color: theme.colorScheme.tertiary),
            );
          }).toList(),
        ),
        if (boulder.polygon != null) ...[
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: boulder.polygon!.toLatLngs,
              ),
            ],
          )
        ],
        AnimateTo(
          mapController: MapController.of(context),
          latLng: boulder.coordinates.toLatLng,
          zoom: 21,
        ),
      ],
    );
  }
}
