import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'data.dart';
import 'explorer/model.dart';
import 'explorer/page.dart';
import 'search/page.dart';
import 'settings/settings_controller.dart';
import 'settings/settings_view.dart';

/// The Widget that configures your application.
class MyApp extends StatelessWidget {
  MyApp({super.key, required this.settingsController, required this.data});

  final SettingsController settingsController;
  final Data data;

  late final _router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        redirect: (_, __) => '/explorer',
        // redirect: (_, __) => '/explorer/boulders/1468',
      ),
      GoRoute(
          path: '/settings',
          pageBuilder: (BuildContext context, GoRouterState state) {
            return const MaterialPage(
              child: SettingsView(),
            );
          }),
      GoRoute(
        path: '/search',
        pageBuilder: (BuildContext context, GoRouterState state) {
          return const MaterialPage(
            restorationId: "search",
            child: SearchPage(),
          );
        },
      ),
      // Note, the explorer routes are just setup for deep linking support.
      // Once initialized, all "routing" is done internal to the explorer widgets,
      // to ensure map widget is kept alive. After this, routing will just
      // serve to update the state and sync navigation.
      GoRoute(
        path: '/explorer',
        pageBuilder: (BuildContext context, GoRouterState state) {
          return const MaterialPage(
            restorationId: "explorer",
            child: ExplorerPage(
              entityType: EntityType.crag,
              entityId: null,
            ),
          );
        },
      ),
      GoRoute(
        path: '/explorer/areas/:areaId',
        pageBuilder: (BuildContext context, GoRouterState state) {
          return MaterialPage(
            child: ExplorerPage(
              entityType: EntityType.area,
              entityId: int.parse(state.pathParameters['areaId']!),
            ),
          );
        },
      ),
      GoRoute(
        path: '/explorer/boulders/:boulderId',
        pageBuilder: (BuildContext context, GoRouterState state) {
          return MaterialPage(
            child: ExplorerPage(
              entityType: EntityType.boulder,
              entityId: int.parse(state.pathParameters['boulderId']!),
            ),
          );
        },
      ),
      GoRoute(
        path: '/explorer/routes/:routeId',
        pageBuilder: (BuildContext context, GoRouterState state) {
          return MaterialPage(
            child: ExplorerPage(
              entityType: EntityType.route,
              entityId: int.parse(state.pathParameters['routeId']!),
            ),
          );
        },
      ),
    ],
  );

  @override
  Widget build(BuildContext context) {
    // Glue the SettingsController to the MaterialApp.
    //
    // The ListenableBuilder Widget listens to the SettingsController for changes.
    // Whenever the user updates their settings, the MaterialApp is rebuilt.
    return ListenableBuilder(
      listenable: settingsController,
      builder: (BuildContext context, Widget? child) {
        return MultiProvider(
          providers: [
            Provider(create: (_) => data.crag),
            Provider(
              lazy: false,
              create: (_) => InheritedPhotosModel(crag: data.crag),
            ),
            ChangeNotifierProvider.value(value: settingsController),
            ChangeNotifierProvider(
              create: (context) => ExplorerSheetModel(),
            ),
            ChangeNotifierProvider(
              create: (context) => ExplorerLayersModel(),
            ),
            ChangeNotifierProvider(
              create: (context) => ExplorerLocationModel(data.crag),
            )
          ],
          child: MaterialApp.router(
            routerConfig: _router,
            // Providing a restorationScopeId allows the Navigator built by the
            // MaterialApp to restore the navigation stack when a user leaves and
            // returns to the app after it has been killed while running in the
            // background.
            restorationScopeId: 'app',

            // Provide the generated AppLocalizations to the MaterialApp. This
            // allows descendant Widgets to display the correct translations
            // depending on the user's locale.
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en', ''), // English, no country code
            ],

            // Use AppLocalizations to configure the correct application title
            // depending on the user's locale.
            //
            // The appTitle is defined in .arb files found in the localization
            // directory.
            onGenerateTitle: (BuildContext context) =>
                AppLocalizations.of(context)!.appTitle,

            // Define a light and dark color theme. Then, read the user's
            // preferred ThemeMode (light, dark, or system default) from the
            // SettingsController to display the correct theme.
            theme: ThemeData(),
            darkTheme: ThemeData.dark(),
            themeMode: settingsController.themeMode,
          ),
        );
      },
    );
  }
}
