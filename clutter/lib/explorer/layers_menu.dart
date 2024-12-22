import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'model.dart';

class LayersMenu extends StatelessWidget {
  const LayersMenu({super.key});

  @override
  Widget build(BuildContext context) {
    final model = Provider.of<ExplorerLayersModel>(context);

    return MenuAnchor(
      builder: (context, controller, child) {
        return IconButton(
          onPressed: () {
            if (controller.isOpen) {
              controller.close();
            } else {
              controller.open();
            }
          },
          tooltip: "Toggle layers",
          icon: const Icon(Icons.layers),
        );
      },
      menuChildren: [
        for (final type in LayerType.values)
          CheckboxMenuButton(
            value: model.isChecked(type),
            onChanged: (bool? b) {
              model.toggleLayer(type);
            },
            closeOnActivate: false,
            child: Text(type.display()),
          ),
      ],
    );
  }
}
