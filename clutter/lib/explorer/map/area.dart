import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';

import '../../entities/area.dart';
import '../../entities/boulder.dart';
import '../model.dart';
import 'animate_to.dart';
import 'my_polygon.dart';

typedef HitValue = ({int id});

class AreaMap extends StatelessWidget {
  const AreaMap({super.key, required this.area});

  final Area area;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final layers = Provider.of<ExplorerLayersModel>(context);
    return Stack(
      children: [
        if (area.polygon != null && layers.isChecked(LayerType.areas))
          PolygonLayer(
            polygons: [
              MyPolygon(
                theme: theme,
                points: area.polygon!.coordinates,
              ),
            ],
          ),
        if (layers.isChecked(LayerType.boulders))
          BouldersLayer(boulders: area.boulders),
        AnimateTo(
          mapController: MapController.of(context),
          latLng: area.center,
          zoom: 19,
        ),
      ],
    );
  }
}

class BouldersLayer extends StatelessWidget {
  const BouldersLayer({
    super.key,
    required this.boulders,
  });

  final List<Boulder> boulders;

  @override
  Widget build(BuildContext context) {
    return MarkerLayer(
      markers: boulders.map((b) {
        return Marker(
          width: 40,
          height: 40,
          point: b.coordinates,
          child: IconButton(
            iconSize: 40,
            onPressed: () => context.read<ExplorerModel>().setBoulder(b.id),
            tooltip: b.name,
            icon: Image.asset(
              'assets/images/boulder_icon.svg.png',
              width: 40,
              height: 40,
              opacity: const AlwaysStoppedAnimation(0.8),
            ),
          ),
        );
      }).toList(),
    );
  }
}
