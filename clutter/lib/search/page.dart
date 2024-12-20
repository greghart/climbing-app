import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../models/crag.dart';
import 'filters.dart';
import 'my_search_bar.dart';
import 'results.dart';
import 'state.dart';

/// Layout for the search page.
class SearchPage extends StatelessWidget {
  const SearchPage({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final crag = context.watch<Crag>();
    return ChangeNotifierProvider(
      create: (context) => SearchState(crag: crag),
      child: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(left: 10.0, right: 10.0),
            child: Column(
              children: [
                // Search bar centered near top of the screen
                // NOTE: Must be kept in step with search bar in [ExplorerPage]
                Center(
                  child: Builder(builder: (context) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: MySearchBar(
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
                            Provider.of<SearchState>(context, listen: false)
                                .setSearch(value),
                      ),
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