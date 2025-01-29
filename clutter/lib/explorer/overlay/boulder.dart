import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/boulder.dart';
import '../model.dart';
import 'difficulty_chart.dart';
import 'difficulty_span.dart';
import 'layout.dart';
import 'topo.dart';

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
          // TODO: Refactor to a re-usable component across all our photo owners
          Text(
            "Photos",
            style: theme.textTheme.headlineSmall,
          ),
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: boulder.photos.length,
              itemBuilder: (context, index) {
                final photo = boulder.photos[index];
                return GestureDetector(
                    child: Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          "assets/photos/${photo.upload!.key}",
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                          alignment: Alignment.center,
                        ),
                      ),
                    ),
                    onTap: () {
                      showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return Dialog(child: Topo(photo: photo));
                          });
                    });
              },
            ),
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
