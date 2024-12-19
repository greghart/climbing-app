import 'package:flutter/material.dart';

import '../../models/index.dart' as models;
import 'layout.dart';

class RouteOverlay extends StatelessWidget {
  const RouteOverlay({
    super.key,
    required this.route,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final models.Route route;
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: route.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            route.grade.raw,
            style: theme.textTheme.headlineMedium,
          ),
          if (route.description != null) ...[
            Text(
              route.description!,
              style: theme.textTheme.bodyMedium,
            )
          ],
        ],
      ),
    );
  }
}
