import 'package:flutter/material.dart';

import '../../models/index.dart' as models;
import 'difficulty_span.dart';
import 'layout.dart';

class RouteOverlay extends StatelessWidget {
  const RouteOverlay({
    super.key,
    required this.route,
  });
  final models.Route route;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: route.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: TextSpan(
              children: [
                DifficultySpan(bucket: route.bucket, text: route.grade.raw),
              ],
              style: theme.textTheme.headlineMedium,
            ),
          ),
          if (route.description != null)
            Text(
              route.description!,
              style: theme.textTheme.bodyMedium,
            ),
        ],
      ),
    );
  }
}
