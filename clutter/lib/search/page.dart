import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';
import 'filters.dart';
import 'my_search_bar.dart';
import 'results.dart';
import 'model.dart';

/// Layout for the search page.
class SearchPage extends StatelessWidget {
  const SearchPage({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    return ChangeNotifierProvider(
      create: (context) => SearchModel(crag: crag),
      child: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(left: 10.0, right: 10, top: 10),
            child: Column(
              children: [
                // Search bar centered near top of the screen
                // NOTE: Must be kept in step with search bar in [ExplorerPage]
                Center(
                  child: Builder(builder: (context) {
                    return MySearchBar(
                      autoFocus: true,
                      hintText: 'Search by area, boulder, or route',
                      leading: IconButton(
                        onPressed: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/explorer');
                          }
                        },
                        icon: const Icon(Icons.arrow_back),
                      ),
                      onChanged: (value) =>
                          Provider.of<SearchModel>(context, listen: false)
                              .setSearch(value),
                    );
                  }),
                ),
                const SearchFilters(),
                const SearchResults(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
