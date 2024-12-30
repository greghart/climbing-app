import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';

import 'color_scheme.dart';

class MyPolygon<HitValue extends Object> extends Polygon<HitValue> {
  MyPolygon({
    required this.theme,
    required super.points,
    Color? color,
    super.pattern = const StrokePattern.dotted(spacingFactor: 2),
    super.borderStrokeWidth = 4.0,
    Color? borderColor,
    super.labelPlacement = PolygonLabelPlacement.polylabel,
    TextStyle? labelStyle,
    super.label,
    super.hitValue,
  }) : super(
          color: color ?? colorScheme.secondary.withValues(alpha: 0.3),
          borderColor: borderColor ?? colorScheme.outline,
          labelStyle: theme.textTheme.labelLarge!.copyWith(
            color: colorScheme.onTertiaryContainer,
            backgroundColor: colorScheme.tertiaryContainer,
          ),
        );

  final ThemeData theme;
}
