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
        PendingRouteMarker(id: route.id),
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

class PendingRouteMarker extends StatefulWidget {
  const PendingRouteMarker({super.key, required this.id});

  final int id;

  @override
  State<PendingRouteMarker> createState() => _PendingRouteMarkerState();
}

class _PendingRouteMarkerState extends State<PendingRouteMarker> {
  late Future<models.LatLng?> _latLng;

  @override
  void initState() {
    super.initState();
    _latLng = Provider.of<ExplorerLocationModel>(context, listen: false)
        .getPendingRouteLocation(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<models.LatLng?>(
      future: _latLng,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return MarkerLayer(
            markers: [
              Marker(
                point: snapshot.data!,
                child: const Icon(
                  Icons.location_pin,
                  size: 20,
                  color: Colors.pink,
                ),
              ),
            ],
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
