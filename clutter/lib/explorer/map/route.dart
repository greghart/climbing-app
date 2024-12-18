import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../models/index.dart' as models;
import '../state.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class RouteMap extends StatelessWidget {
  const RouteMap({super.key, required this.route});

  final models.Route route;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final state = Provider.of<ExplorerState>(context);
    return Stack(
      children: [
        MarkerLayer(
          markers: [
            Marker(
              point: route.coordinates!.toLatLng,
              // TODO: Bring in route icon
              child: Icon(Icons.location_pin,
                  size: 20, color: theme.colorScheme.tertiary),
            ),
          ],
        ),
        if (state.boulder!.polygon != null) ...[
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: state.boulder!.polygon!.toLatLngs,
              ),
            ],
          )
        ],
        AnimateTo(
          mapController: MapController.of(context),
          latLng: route.coordinates!.toLatLng,
          zoom: 22,
        ),
      ],
    );
  }
}
