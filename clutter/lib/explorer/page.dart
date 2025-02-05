import 'package:back_button_interceptor/back_button_interceptor.dart';
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
      child: const BackHandler(
        child: SafeArea(
          child: ExplorerLayout(
            map: MyMap(
              child: MapBuilder(),
            ),
            search: Padding(
              padding: EdgeInsets.symmetric(horizontal: 8.0),
              child: ExplorerSearchBar(),
            ),
            overlay: OverlaySheet(
              sliver: OverlayBuilder(),
            ),
          ),
        ),
      ),
    );
  }
}

// Search bar that shouldn't focus or activate keyboard!
class ExplorerSearchBar extends StatefulWidget {
  const ExplorerSearchBar({
    super.key,
  });

  @override
  State<ExplorerSearchBar> createState() => _ExplorerSearchBarState();
}

class _ExplorerSearchBarState extends State<ExplorerSearchBar> {
  late FocusNode myFocusNode;

  @override
  void initState() {
    super.initState();

    myFocusNode = FocusNode(canRequestFocus: false);
  }

  @override
  void dispose() {
    myFocusNode.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MySearchBar(
      autoFocus: false,
      focusNode: myFocusNode,
      hintText: "Search crag...",
      onTap: () {
        context.push('/search');
        myFocusNode.unfocus();
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
    );
  }
}

// Intercepts back button to go back for this explorer model stack
class BackHandler extends StatefulWidget {
  final Widget child;
  const BackHandler({super.key, required this.child});

  @override
  State<BackHandler> createState() => _BackHandlerState();
}

class _BackHandlerState extends State<BackHandler> {
  @override
  void initState() {
    super.initState();
    BackButtonInterceptor.add(myInterceptor, context: context);
  }

  @override
  void dispose() {
    BackButtonInterceptor.remove(myInterceptor);
    super.dispose();
  }

  bool myInterceptor(bool stopDefaultButtonEvent, RouteInfo info) {
    // Only intercept when still on explorer page
    if (info.ifRouteChanged(context)) return false;

    return context.read<ExplorerModel>().popRouteStack();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
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
