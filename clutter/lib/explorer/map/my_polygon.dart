import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';

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
          color: color ?? theme.colorScheme.secondaryContainer.withOpacity(0.5),
          borderColor: borderColor ?? theme.colorScheme.secondary,
          labelStyle: theme.textTheme.bodyMedium!
              .copyWith(color: theme.colorScheme.onSecondaryContainer),
        );

  final ThemeData theme;
}