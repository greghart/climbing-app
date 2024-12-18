import 'package:flutter/material.dart';

const searchConstraints =
    BoxConstraints(minWidth: 360.0, maxWidth: 480.0, minHeight: 36.0);

class MySearchBar extends SearchBar {
  const MySearchBar({
    super.key,
    super.constraints = searchConstraints,
    super.onTap,
    super.autoFocus,
    super.hintText,
    super.leading,
    super.onChanged,
  });
}
