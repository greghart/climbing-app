import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';
import './layout.dart';
import './map.dart';
import './overlay.dart';
import 'map/area.dart';
import 'map/boulder.dart';
import 'map/crag.dart';
import 'map/route.dart';
import 'overlay/area.dart';
import 'overlay/boulder.dart';
import 'overlay/crag.dart';
import 'overlay/route.dart';
import 'state.dart';

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
    return ChangeNotifierProvider(
      create: (context) =>
          ExplorerState(crag: crag, entityType: entityType, entityId: entityId),
      child: ExplorerLayout(
        map: const MyMap(
          child: MapBuilder(),
        ),
        // TODO: Make this open the search page once I figure out routing
        search: SearchBar(
          constraints: const BoxConstraints(
              minWidth: 360.0, maxWidth: 480.0, minHeight: 36.0),
          onTap: () {
            context.go('/search');
          },
        ),
        overlay: OverlaySheet(
          build: (ScrollController scrollController, bool isOnDesktopAndWeb) {
            return OverlayBuilder(
                scrollController: scrollController,
                isOnDesktopAndWeb: isOnDesktopAndWeb);
          },
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
    var state = context.watch<ExplorerState>();
    switch (state.entityType) {
      case EntityType.area:
        return AreaMap(area: state.area!);
      case EntityType.boulder:
        return BoulderMap(boulder: state.boulder!);
      case EntityType.route:
        return RouteMap(route: state.route!);
      default:
        return const CragMap();
    }
  }
}

class OverlayBuilder extends StatelessWidget {
  const OverlayBuilder({
    super.key,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    var state = context.watch<ExplorerState>();
    switch (state.entityType) {
      case EntityType.area:
        return AreaOverlay(
            area: state.area!,
            scrollController: scrollController,
            isOnDesktopAndWeb: isOnDesktopAndWeb);
      case EntityType.boulder:
        return BoulderOverlay(
            boulder: state.boulder!,
            scrollController: scrollController,
            isOnDesktopAndWeb: isOnDesktopAndWeb);
      case EntityType.route:
        return RouteOverlay(
            route: state.route!,
            scrollController: scrollController,
            isOnDesktopAndWeb: isOnDesktopAndWeb);
      default:
        return CragOverlay(
            scrollController: scrollController,
            isOnDesktopAndWeb: isOnDesktopAndWeb);
    }
  }
}
