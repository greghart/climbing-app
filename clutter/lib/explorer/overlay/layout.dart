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
    return Column(
      children: [
        Row(children: [Breadcrumbs(title: title)]),
        const Divider(),
        Expanded(child: child),
      ],
    );
  }
}

class Breadcrumbs extends StatelessWidget {
  const Breadcrumbs({super.key, required this.title});

  final String title;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final state = context.watch<ExplorerState>();

    return Wrap(
      spacing: 8,
      children: [
        if (state.area != null) ...[
          FilledButton(
            style: const ButtonStyle(
              visualDensity: VisualDensity.compact,
            ),
            onPressed: () {
              Provider.of<ExplorerState>(context, listen: false).setCrag();
            },
            child: Text(state.crag.name),
          ),
          divider(theme),
        ],
        if (state.boulder != null) ...[
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
          divider(theme),
        ],
        if (state.route != null) ...[
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
          divider(theme),
        ],
        Text(
          title,
          style: theme.textTheme.headlineSmall!,
        ),
      ].whereType<Widget>().toList(),
    );
  }

  Widget divider(ThemeData theme) {
    return Text(" / ", style: theme.textTheme.headlineSmall!);
  }
}
