import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/area.dart';
import '../model.dart';
import 'difficulty_chart.dart';
import 'difficulty_span.dart';
import 'layout.dart';

class AreaOverlay extends StatelessWidget {
  const AreaOverlay({
    super.key,
    required this.area,
  });
  final Area area;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return OverlayLayout(
      title: area.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (area.description != null)
            Container(
              padding: const EdgeInsets.only(bottom: 8, top: 8),
              child: Text(
                area.description!,
                style: theme.textTheme.bodyMedium,
              ),
            ),
          DiagramsLayout(
            chart: DifficultyChartCard(breakdown: area.difficultyBreakdown),
          ),
          Text(
            "Boulders",
            style: theme.textTheme.headlineSmall,
          ),
          for (final boulder in area.boulders)
            ListTile(
              onTap: () => context.read<ExplorerModel>().setBoulder(boulder.id),
              trailing: const Icon(Icons.navigate_next),
              title: DifficultyBreakdownSpan(
                text: boulder.name,
                breakdown: boulder.difficultyBreakdown,
              ),
            )
        ],
      ),
    );
  }
}
