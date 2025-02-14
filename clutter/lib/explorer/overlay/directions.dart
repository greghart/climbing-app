import 'package:flutter/material.dart';

import '../../entities/crag.dart';
import '../../util/openMap.dart';

// Simple widget that displays a button for directions (to crag or parking)
// and whatever parking directions there are
class Directions extends StatelessWidget {
  const Directions({super.key, required this.crag});

  final Crag crag;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ElevatedButton.icon(
          onPressed: () => openMap(crag.parking?.location ?? crag.center),
          icon: const Icon(Icons.directions),
          label: Text('Directions to ${crag.parking?.name ?? crag.name}'),
        ),
        if (crag.parking != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(crag.parking!.description),
          ),
      ],
    );
  }
}
