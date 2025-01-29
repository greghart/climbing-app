import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../entities/index.dart' as entities;
import '../model.dart';
import 'topo.dart';

class Photos extends StatelessWidget {
  final List<entities.Photo> photos;
  const Photos({
    super.key,
    required this.photos,
    this.areaId,
    this.boulderId,
    this.routeId,
  });

  // Used to filter which topogons are shown
  final int? areaId;
  final int? boulderId;
  final int? routeId;

  @override
  Widget build(BuildContext context) {
    if (photos.isEmpty) {
      return const SizedBox.shrink();
    }
    final model = context.read<ExplorerModel>();
    final theme = Theme.of(context);

    return Column(
      spacing: 8,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Photos",
          style: theme.textTheme.headlineSmall,
        ),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: photos.length,
            itemBuilder: (context, index) {
              final photo = photos[index];
              return GestureDetector(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Topo(
                        model: model,
                        photo: photo,
                        labels: false,
                        areaId: areaId,
                        boulderId: boulderId,
                        routeId: routeId,
                      ),
                    ),
                  ),
                  onTap: () {
                    showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return Dialog(
                            child: Topo(
                              model: model,
                              photo: photo,
                              areaId: areaId,
                              boulderId: boulderId,
                              routeId: routeId,
                            ),
                          );
                        });
                  });
            },
          ),
        ),
      ],
    );
  }
}
