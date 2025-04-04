import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../entities/crag.dart';
import '../current_location.dart';
import 'sun.dart';
import 'trails.dart';

class MyMap extends StatelessWidget {
  const MyMap({super.key, this.child});

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    final mapController = MapController();

    return FlutterMap(
        mapController: mapController,
        options: MapOptions(
            initialCenter: crag.center,
            initialZoom: crag.defaultZoom.toDouble(),
            maxZoom: crag.maxZoom.toDouble(),
            minZoom: crag.minZoom.toDouble(),
            keepAlive: true,
            cameraConstraint: CameraConstraint.containCenter(
              bounds: crag.bounds.toLatLngBounds,
            ),
            interactionOptions: const InteractionOptions(
              flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
            )),
        children: [
          const BestTileLayer(),
          CurrentLocation(crag: crag),
          TrailsLayer(crag: crag),
          const SunLayer(),
          child,
          RichAttributionWidget(
            // Include a stylish prebuilt attribution widget that meets all requirments
            attributions: [
              TextSourceAttribution(
                'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
                onTap: () => launchUrl(
                  Uri.parse(
                    'https://www.arcgis.com/home/item.html?id=226d23f076da478bba4589e7eae95952',
                  ),
                ), // (external)
              ),
            ],
          ),
        ].whereType<Widget>().toList());
  }
}

// Define tile layers in an object
final tileLayers = {
  // Newer tiles
  'WGS84':
      "https://wi.maptiles.arcgis.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Classic world
  'World':
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Muted tiles
  'Firefly':
      "https://servicesbeta.arcgisonline.com/arcgis/rest/services/Firefly_World_Imagery/MapServer/tile/{z}/{y}/{x}",
  // Physical map
  'Physical':
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
  // OpenStreetMap
  'OpenStreetMap': "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  // MapBox
  'MapBox':
      "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${const String.fromEnvironment('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN', defaultValue: '')}",
  // Serve from our server
  'Local': "assets/tiles/{x}/{y}/{z}.png",
};

class BestTileLayer extends StatelessWidget {
  const BestTileLayer({super.key, this.layer = "Local"});

  final String? layer;

  @override
  Widget build(BuildContext context) {
    return TileLayer(
      tileProvider:
          layer == 'Local' ? AssetTileProvider() : NetworkTileProvider(),
      fallbackUrl: "assets/tiles/fallback.png",
      urlTemplate: tileLayers[layer],
      userAgentPackageName: 'greghart.climbing-app',
      errorTileCallback: (tile, error, stackTrace) {},
      minNativeZoom: 15,
      maxNativeZoom: 19,
      maxZoom: 22,
    );
  }
}
