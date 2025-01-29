import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/boulder.dart';
import '../model.dart';
import 'difficulty_chart.dart';
import 'difficulty_span.dart';
import 'layout.dart';
import 'photos.dart';

class BoulderOverlay extends StatelessWidget {
  const BoulderOverlay({
    super.key,
    required this.boulder,
  });
  final Boulder boulder;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: boulder.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          if (boulder.description != null)
            Text(
              boulder.description!,
              style: theme.textTheme.bodyMedium,
            ),
          DiagramsLayout(
            chart: DifficultyChartCard(breakdown: boulder.difficultyBreakdown),
          ),
          Photos(photos: boulder.photos),
          Text(
            "Routes",
            style: theme.textTheme.headlineSmall,
          ),
          for (final route in boulder.routes)
            ListTile(
              onTap: () => context.read<ExplorerModel>().setRoute(route.id),
              trailing: const Icon(Icons.navigate_next),
              title: RichText(
                text: TextSpan(
                  text: route.name,
                  style: theme.textTheme.bodyMedium,
                  children: [
                    const TextSpan(text: ' ('),
                    DifficultySpan(
                      text: route.grade.raw,
                      bucket: route.bucket,
                    ),
                    const TextSpan(text: ')'),
                  ],
                ),
              ),
            )
        ],
      ),
    );
  }
}
