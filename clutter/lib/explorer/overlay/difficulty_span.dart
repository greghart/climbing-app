import 'package:collection/collection.dart';
import 'package:flutter/material.dart';

import '../../models/difficulty_breakdown.dart';

// Colors by bucket key
const difficultyColors = [
  Colors.green,
  Colors.blue,
  Colors.yellow,
  Colors.red,
  Colors.purple,
  Colors.black,
];

class DifficultySpan extends TextSpan {
  DifficultySpan({
    super.text,
    required this.bucket,
  }) : super(
          style: TextStyle(
            color: difficultyColors[bucket.key],
          ),
        );

  final DifficultyBucket bucket;
}

class DifficultyBreakdownSpan extends StatelessWidget {
  const DifficultyBreakdownSpan(
      {super.key, required this.text, required this.breakdown});

  final String text;
  final DifficultyBreakdown breakdown;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return RichText(
      text: TextSpan(
        style: theme.textTheme.bodyMedium,
        children: <TextSpan>[
          TextSpan(text: text),
          TextSpan(
            style: const TextStyle(fontWeight: FontWeight.bold),
            children: [
              const TextSpan(text: ' ('),
              ...breakdown.bucketCounts.keys.expandIndexed((i, b) {
                final count = breakdown.bucketCounts[b];
                return [
                  if (i != 0) const TextSpan(text: " / "),
                  DifficultySpan(
                    bucket: b,
                    text: count.toString(),
                  )
                ];
              }),
              const TextSpan(text: ')'),
            ],
          ),
        ],
      ),
    );
  }
}
