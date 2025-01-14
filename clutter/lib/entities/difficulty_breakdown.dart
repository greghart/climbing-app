import 'dart:math';

import 'grade.dart';
import 'route.dart';

typedef DifficultyBucket = ({
  int key,
  String label,
  int threshold,
});

const List<DifficultyBucket> difficultyBuckets = [
  (key: 0, label: 'VB-0', threshold: 15),
  (key: 1, label: 'V1-3', threshold: 45),
  (key: 2, label: 'V4-5', threshold: 69),
  (key: 3, label: 'V6-7', threshold: 89),
  (key: 4, label: 'V8-9', threshold: 109),
  (key: 5, label: 'V10++', threshold: 1000),
];
final bucketsByKey = {for (var bucket in difficultyBuckets) bucket.key: bucket};
DifficultyBucket getBucket(Grade g) {
  for (final bucket in difficultyBuckets) {
    if (g.value < bucket.threshold) {
      return bucket;
    }
  }
  throw Exception('Grade ${g.value} is out of range');
}

/// Stores grades and their respective counts
class DifficultyBreakdown {
  DifficultyBreakdown(
    List<Route> routes,
  ) {
    gradeCounts = <String, int>{};
    bucketCounts = {for (var bucket in difficultyBuckets) bucket: 0};
    for (final route in routes) {
      // Per v grade
      final key = displayGradeValue(route.grade.value);
      gradeCounts[key] = (gradeCounts[key] ?? 0) + 1;
      // Per bucket
      bucketCounts[route.bucket] = bucketCounts[route.bucket]! + 1;
    }
    maxGradeCount = gradeCounts.values.reduce(max);
    maxBucketCount = bucketCounts.values.reduce(max);
  }

  late final Map<String, int> gradeCounts;
  late final int maxGradeCount;

  late final Map<DifficultyBucket, int> bucketCounts;
  late final int maxBucketCount;

  getBucket(int key) {
    return bucketsByKey[key];
  }
}
