import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'settings_controller.dart';

/// Displays the various settings that can be customized by the user.
///
/// When a user changes a setting, the SettingsController is updated and
/// Widgets that listen to the SettingsController are rebuilt.
class SettingsView extends StatelessWidget {
  const SettingsView({super.key});

  static const routeName = '/settings';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final settings = Provider.of<SettingsController>(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        // Glue the SettingsController to the theme selection DropdownButton.
        //
        // When a user selects a theme from the dropdown list, the
        // SettingsController is updated, which rebuilds the MaterialApp.
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 16,
          children: [
            Column(
              children: [
                Text("Theme", style: theme.textTheme.labelLarge),
                DropdownButton<ThemeMode>(
                  // Read the selected themeMode from the controller
                  value: settings.themeMode,
                  // Call the updateThemeMode method any time the user selects a theme.
                  onChanged: settings.updateThemeMode,
                  items: const [
                    DropdownMenuItem(
                      value: ThemeMode.system,
                      child: Text('System Theme'),
                    ),
                    DropdownMenuItem(
                      value: ThemeMode.light,
                      child: Text('Light Theme'),
                    ),
                    DropdownMenuItem(
                      value: ThemeMode.dark,
                      child: Text('Dark Theme'),
                    )
                  ],
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Cozy compass", style: theme.textTheme.labelLarge),
                Text("Use an inline compass in breadcrumbs",
                    style: theme.textTheme.labelSmall),
                Checkbox(
                  // Read the selected themeMode from the controller
                  value: settings.cozyCompass,
                  // Call the updateThemeMode method any time the user selects a theme.
                  onChanged: settings.updateCozyCompass,
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Wide images", style: theme.textTheme.labelLarge),
                Text(
                    "Only constrain image height, resulting in wider, scrollable images ",
                    style: theme.textTheme.labelSmall),
                Checkbox(
                  // Read the selected themeMode from the controller
                  value: settings.wideImages,
                  // Call the updateThemeMode method any time the user selects a theme.
                  onChanged: settings.updateWideImages,
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Reset tutorial", style: theme.textTheme.labelLarge),
                Text(
                  "Reset the tutorial so it displays again next time you open the app (may need to restar the app)",
                  style: theme.textTheme.labelSmall,
                ),
                FilledButton(
                  style: const ButtonStyle(
                    visualDensity: VisualDensity.compact,
                  ),
                  onPressed: () => settings.resetTutorials(),
                  child: const Text("Reset"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
