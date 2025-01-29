import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../entities/crag.dart';
import '../search/my_search_bar.dart';
import './layout.dart';
import 'layers_menu.dart';
import 'map/area.dart';
import 'map/boulder.dart';
import 'map/crag.dart';
import 'map/map.dart';
import 'map/route.dart';
import 'model.dart';
import 'overlay/area.dart';
import 'overlay/boulder.dart';
import 'overlay/crag.dart';
import 'overlay/route.dart';
import 'overlay/sheet.dart';

class ExplorerPage extends StatelessWidget {
  const ExplorerPage({
    super.key,
    required this.entityType,
    this.entityId,
  });

  final EntityType entityType;
  final int? entityId;

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => ExplorerModel(
            crag: crag,
            entityType: entityType,
            entityId: entityId,
          ),
        ),
      ],
      child: SafeArea(
        child: ExplorerLayout(
          map: const MyMap(
            child: MapBuilder(),
          ),
          search: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: MySearchBar(
              hintText: "Search crag...",
              onTap: () {
                context.push('/search');
              },
              leading: Builder(builder: (context) {
                return IconButton(
                  onPressed: () {
                    Scaffold.of(context).openDrawer();
                  },
                  icon: const Icon(Icons.menu),
                );
              }),
              trailing: const [
                LayersMenu(),
              ],
            ),
          ),
          overlay: const OverlaySheet(
            sliver: OverlayBuilder(),
          ),
        ),
      ),
    );
  }
}

class MapBuilder extends StatelessWidget {
  const MapBuilder({
    super.key,
  });
  @override
  Widget build(BuildContext context) {
    var model = context.watch<ExplorerModel>();
    switch (model.entityType) {
      case EntityType.area:
        return AreaMap(area: model.area!);
      case EntityType.boulder:
        return BoulderMap(boulder: model.boulder!);
      case EntityType.route:
        return RouteMap(route: model.route!);
      default:
        return const CragMap();
    }
  }
}

class OverlayBuilder extends StatelessWidget {
  const OverlayBuilder({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var model = context.watch<ExplorerModel>();
    switch (model.entityType) {
      case EntityType.area:
        return AreaOverlay(area: model.area!);
      case EntityType.boulder:
        return BoulderOverlay(boulder: model.boulder!);
      case EntityType.route:
        return RouteOverlay(route: model.route!);
      default:
        return const CragOverlay();
    }
  }
}
