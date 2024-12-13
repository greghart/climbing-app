import 'package:clutter/data.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CragOverlay extends StatelessWidget {
  const CragOverlay({
    super.key,
    required this.scrollController,
    required this.isOnDesktopAndWeb,
  });
  final ScrollController scrollController;
  final bool isOnDesktopAndWeb;

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final data = context.watch<Data>();
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Text(
            data.crag.name,
            style: theme.textTheme.displaySmall!,
          ),
        ),
        const Divider(),
        Text(
          "Areas",
          style: theme.textTheme.headlineSmall,
        ),
        Flexible(
          child: ListView.builder(
            controller: isOnDesktopAndWeb ? null : scrollController,
            itemCount: data.crag.areas.length,
            itemBuilder: (BuildContext context, int index) {
              return ListTile(
                onTap: () {
                  print("here we go");
                },
                trailing: const Icon(Icons.navigate_next),
                title: Text(
                  'Area ${data.crag.areas[index].name}',
                  // TODO: Set color properly
                  style: theme.textTheme.bodyMedium,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
