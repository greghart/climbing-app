import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../entities/difficulty_breakdown.dart';
import '../../util/color.dart';
import 'difficulty_span.dart';

/// Should be within a constrained parent
class DifficultyChartCard extends StatelessWidget {
  const DifficultyChartCard({super.key, required this.breakdown});
  final DifficultyBreakdown breakdown;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      color: theme.colorScheme.primaryContainer,
      child: Column(
        spacing: 8,
        children: [
          Text(
            "Route Breakdown",
            style: theme.textTheme.titleSmall,
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(8),
              child: DifficultyChart(
                breakdown: breakdown,
                colorScheme: theme.colorScheme,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class DifficultyChart extends StatefulWidget {
  DifficultyChart({
    super.key,
    required this.breakdown,
    required this.colorScheme,
  })  : barColor = colorScheme.primary,
        barBackgroundColor =
            darken(colorScheme.primary, 0.8).withValues(alpha: 0.1),
        touchedBarColor = darken(colorScheme.primary, 0.8);

  final DifficultyBreakdown breakdown;
  final ColorScheme colorScheme;
  final Color barColor;
  final Color barBackgroundColor;
  final Color touchedBarColor;

  @override
  State<DifficultyChart> createState() => _DifficultyChartState();
}

class _DifficultyChartState extends State<DifficultyChart> {
  int touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return BarChart(
      BarChartData(
        barTouchData: BarTouchData(
          touchCallback: (FlTouchEvent event, barTouchResponse) {
            setState(() {
              if (!event.isInterestedForInteractions ||
                  barTouchResponse == null ||
                  barTouchResponse.spot == null) {
                touchedIndex = -1;
                return;
              }
              touchedIndex = barTouchResponse.spot!.touchedBarGroupIndex;
            });
          },
          touchTooltipData: BarTouchTooltipData(
            getTooltipColor: (_) => Colors.blueGrey,
            tooltipHorizontalAlignment: FLHorizontalAlignment.right,
            tooltipMargin: -10,
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              return BarTooltipItem(
                '${widget.breakdown.getBucket(groupIndex).label}\n',
                const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
                children: <TextSpan>[
                  TextSpan(
                    text: (rod.toY - 1).toInt().toString(),
                    style: const TextStyle(
                      color: Colors.white, //widget.touchedBarColor,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              );
            },
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: getTitles,
              reservedSize: 38,
            ),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(
              showTitles: false,
            ),
          ),
        ),
        borderData: FlBorderData(
          show: false,
        ),
        barGroups: widget.breakdown.bucketCounts.keys
            .map((bucket) => makeBucketData(bucket))
            .toList(),
        gridData: const FlGridData(show: false),
      ),
    );
  }

  Widget getTitles(double value, TitleMeta meta) {
    final bucket = widget.breakdown.getBucket(value.toInt());
    return SideTitleWidget(
      meta: meta,
      space: 16,
      child: Text(
        bucket.label,
        style: TextStyle(color: difficultyColors[bucket.key]),
      ),
    );
  }

  BarChartGroupData makeBucketData(
    DifficultyBucket bucket, {
    Color? barColor,
    double width = 22,
    List<int> showTooltips = const [],
  }) {
    final x = bucket.key;
    final y = widget.breakdown.bucketCounts[bucket]!.toDouble();
    final isTouched = x == touchedIndex;
    barColor ??= widget.barColor;
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: y,
          color: isTouched ? widget.touchedBarColor : barColor,
          width: width,
          borderSide: isTouched
              ? BorderSide(color: darken(widget.touchedBarColor, .8))
              : const BorderSide(color: Colors.white, width: 0),
          backDrawRodData: BackgroundBarChartRodData(
            show: true,
            toY: widget.breakdown.maxBucketCount.toDouble(),
            color: widget.barBackgroundColor,
          ),
        ),
      ],
      showingTooltipIndicators: showTooltips,
    );
  }
}
