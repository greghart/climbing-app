import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/boulder.dart';
import '../model.dart';
import 'compass.dart';
import 'difficulty_chart.dart';
import 'difficulty_span.dart';
import 'layout.dart';

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
        children: [
          if (boulder.description != null)
            Container(
              padding: const EdgeInsets.only(bottom: 8, top: 8),
              child: Text(
                boulder.description!,
                style: theme.textTheme.bodyMedium,
              ),
            ),
          DiagramsLayout(
            chart: DifficultyChartCard(breakdown: boulder.difficultyBreakdown),
          ),
          Text(
            "Routes",
            style: theme.textTheme.headlineSmall,
          ),
          for (final route in boulder.routes)
            ListTile(
              onTap: () {
                Provider.of<ExplorerModel>(context, listen: false)
                    .setRoute(route.id);
              },
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
