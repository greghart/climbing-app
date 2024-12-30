import 'package:flutter/material.dart';

/// A static color scheme for mapping purposes
/// TODO: This should likely be dynamic per crag, since the map colors can change significantly.
/// Eg. Santee is green, so using green as a seed color means we can get a nice palette.
final colorScheme =
    ColorScheme.fromSeed(brightness: Brightness.light, seedColor: Colors.green);
