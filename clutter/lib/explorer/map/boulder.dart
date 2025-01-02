import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../models/boulder.dart';
import '../model.dart';
import 'animate_to.dart';
import 'area.dart';
import 'color_scheme.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class BoulderMap extends StatelessWidget {
  const BoulderMap({super.key, required this.boulder});

  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final layers = Provider.of<ExplorerLayersModel>(context);

    return Stack(
      children: [
        BoulderMapDirect(boulder: boulder),
        if (layers.isChecked(LayerType.routes))
          MarkerLayer(
            // TODO: Clustering around boulder
            markers:
                boulder.routes.where((r) => r.coordinates != null).map((r) {
              return Marker(
                point: r.coordinates!,
                height: 20,
                width: 20,
                child: GestureDetector(
                  onTap: () {
                    Provider.of<ExplorerModel>(context, listen: false)
                        .setRoute(r.id);
                  },
                  child: Tooltip(
                    message: r.name,
                    child: Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: colorScheme.tertiary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: boulder.coordinates,
          zoom: 21,
        ),
      ],
    );
  }
}

// Directly draw the boulder (icon or polygon), without its' routes
class BoulderMapDirect extends StatelessWidget {
  const BoulderMapDirect({
    super.key,
    required this.boulder,
  });

  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final layers = Provider.of<ExplorerLayersModel>(context);
    if (!layers.isChecked(LayerType.boulders)) {
      return const SizedBox.shrink();
    }
    if (boulder.polygon != null) {
      return PolygonLayer(
        polygons: [
          MyPolygon(
            theme: theme,
            points: boulder.polygon!.coordinates,
          ),
        ],
      );
    } else {
      return BouldersLayer(boulders: [boulder]);
    }
  }
}
