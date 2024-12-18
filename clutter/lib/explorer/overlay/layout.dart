import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state.dart';

class OverlayLayout extends StatelessWidget {
  const OverlayLayout({
    super.key,
    required this.title,
    required this.child,
    this.breadcrumbs,
  });
  final String title;
  final Widget child;

  /// Leave a trail of breadcrumbs up the path
  final List<Widget>? breadcrumbs;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Breadcrumbs(),
            Text(
              title,
              style: theme.textTheme.headlineSmall!,
            ),
          ].whereType<Widget>().toList(),
        ),
        const Divider(),
        Flexible(child: child),
      ],
    );
  }
}

class Breadcrumbs extends StatelessWidget {
  const Breadcrumbs({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final state = context.watch<ExplorerState>();
    if (state.entityType == EntityType.crag) {
      return const SizedBox.shrink();
    }

    return Wrap(
      spacing: 8,
      children: [
        FilledButton(
          style: const ButtonStyle(
            visualDensity: VisualDensity.compact,
          ),
          onPressed: () {
            Provider.of<ExplorerState>(context, listen: false).setCrag();
          },
          child: Text(state.crag.name),
        ),
        if (state.boulder != null) ...[
          divider(theme),
          FilledButton(
            style: const ButtonStyle(
              visualDensity: VisualDensity.compact,
            ),
            onPressed: () {
              Provider.of<ExplorerState>(context, listen: false)
                  .setArea(state.area!.id);
            },
            child: Text(state.area!.name),
          ),
        ],
        if (state.route != null) ...[
          divider(theme),
          FilledButton(
            style: const ButtonStyle(
              visualDensity: VisualDensity.compact,
            ),
            onPressed: () {
              Provider.of<ExplorerState>(context, listen: false)
                  .setBoulder(state.boulder!.id);
            },
            child: Text(state.boulder!.name),
          ),
        ],
        divider(theme),
      ].whereType<Widget>().toList(),
    );
  }

  Widget divider(ThemeData theme) {
    return Text(" / ", style: theme.textTheme.headlineSmall!);
  }
}
