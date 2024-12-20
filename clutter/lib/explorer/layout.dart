import 'package:flutter/material.dart';

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
        ],
      ),
    );
  }
}
