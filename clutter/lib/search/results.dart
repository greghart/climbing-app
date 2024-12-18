import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'state.dart';

class SearchResults extends StatelessWidget {
  const SearchResults({super.key});

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<SearchState>(context);
    final theme = Theme.of(context);
    return Flexible(
      child: Container(
        constraints: const BoxConstraints(minWidth: 360.0, maxWidth: 640.0),
        child: content(state, theme),
      ),
    );
  }

  content(SearchState state, ThemeData theme) {
    if (state.isLoading) {
      return const LinearProgressIndicator();
    }
    return ListView.builder(
      itemCount: state.results.length,
      itemBuilder: (BuildContext context, int index) {
        return ListTile(
          dense: true,
          onTap: () {
            switch (state.results[index].type) {
              case SearchType.area:
                context.go('/explorer/areas/${state.results[index].id}');
              case SearchType.boulder:
                context.go('/explorer/boulders/${state.results[index].id}');
              case SearchType.route:
                context.go('/explorer/routes/${state.results[index].id}');
              default:
                throw Exception(
                    'Unknown search result type ${state.results[index].type} (${state.results[index].id})');
            }
          },
          trailing: const Icon(Icons.navigate_next),
          title: Text(
            '${state.results[index].type.display()} | ${state.results[index].name} ${state.results[index].grade != null ? '(${state.results[index].grade!.raw})' : ''}',
            style: theme.textTheme.bodyMedium,
          ),
        );
      },
    );
  }
}
