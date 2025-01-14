import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../entities/index.dart' as models;
import '../model.dart';
import 'animate_to.dart';
import 'boulder.dart';

typedef HitValue = ({int id});

class RouteMap extends StatelessWidget {
  const RouteMap({super.key, required this.route});

  final models.Route route;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final model = Provider.of<ExplorerModel>(context);
    final layers = Provider.of<ExplorerLayersModel>(context);

    return Stack(
      children: [
        if (layers.isChecked(LayerType.routes) && route.coordinates != null)
          MarkerLayer(
            markers: [
              Marker(
                point: route.coordinates!,
                // TODO: Bring in route icon
                child: Icon(Icons.location_pin,
                    size: 20, color: theme.colorScheme.secondary),
              ),
            ],
          ),
        BoulderMapDirect(boulder: model.boulder!),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: route.coordinates ?? model.boulder!.coordinates,
          zoom: 22,
        ),
      ],
    );
  }
}
