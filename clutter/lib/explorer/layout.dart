import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'tutorial.dart';

/// Layout for the explorer page.
class ExplorerLayout extends StatelessWidget {
  const ExplorerLayout({
    super.key,
    required this.map,
    required this.overlay,
    required this.search,
  });

  final Widget map;
  final Widget overlay;
  final Widget search;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          map,
          // Search bar centered near top of the screen
          Positioned(
            top: 10,
            left: 0,
            right: 0,
            child: Center(child: search),
          ),
          overlay,
          const Tutorial(),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          // Important: Remove any padding from the ListView.
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Text('Boulder Buddy'),
            ),
            ListTile(
              title: const Text('Explorer'),
              onTap: () {
                context.push('/explorer');
              },
            ),
            ListTile(
              title: const Text('Settings'),
              onTap: () {
                context.push('/settings');
              },
            ),
          ],
        ),
      ),
    );
  }
}
