import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/crag.dart';
import '../model.dart';
import 'difficulty_chart.dart';
import 'difficulty_span.dart';
import 'layout.dart';
import 'photos.dart';

class CragOverlay extends StatelessWidget {
  const CragOverlay({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    final theme = Theme.of(context);

    return OverlayLayout(
      title: crag.name,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(bottom: 8, top: 8),
            child: Text(
              crag.description!,
              style: theme.textTheme.bodyMedium,
            ),
          ),
          Photos(photos: crag.photos),
          DiagramsLayout(
            chart: DifficultyChartCard(breakdown: crag.difficultyBreakdown),
          ),
          Text(
            "Areas",
            style: theme.textTheme.headlineSmall,
          ),
          for (final area in crag.areas)
            ListTile(
              onTap: () => context.read<ExplorerModel>().setArea(area.id),
              trailing: const Icon(Icons.navigate_next),
              title: DifficultyBreakdownSpan(
                text: area.name,
                breakdown: area.difficultyBreakdown,
              ),
            )
        ],
      ),
    );
  }
}
