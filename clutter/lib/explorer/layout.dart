import 'package:flutter/material.dart';

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
    return LayoutBuilder(builder: (context, constraints) {
      return Scaffold(
        body: Stack(
          children: [
            map,
            // Search bar centered near top of the screen
            Positioned.fill(
              top: 50,
              child: SizedBox(
                width: 120,
                child: search,
              ),
            ),
            overlay,
          ],
        ),
      );
    });
  }
}
