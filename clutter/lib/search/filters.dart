import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'model.dart';
import 'my_search_bar.dart';

class SearchFilters extends StatelessWidget {
  const SearchFilters({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: searchConstraints,
      child: Card.outlined(
        child: ExpansionPanelList.radio(
          children: [
            ExpansionPanelRadio(
              value: 0,
              canTapOnHeader: true,
              headerBuilder: (BuildContext context, bool isExpanded) {
                return const ListTile(title: Text("Search filters"));
              },
              body: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
                child: SearchForm(),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class SearchForm extends StatefulWidget {
  const SearchForm({super.key});

  @override
  State<SearchForm> createState() => _SearchFormState();
}

class _SearchFormState extends State<SearchForm> {
  @override
  Widget build(BuildContext context) {
    final model = Provider.of<SearchModel>(context);
    return Row(
      children: [
        Expanded(
          child: Form(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 8.0,
              children: [
                DropdownMenu<SearchType>(
                  onSelected: (value) => model.setType(value!),
                  initialSelection: model.type,
                  label: const Text("Search by"),
                  dropdownMenuEntries: const [
                    DropdownMenuEntry(label: "Any", value: SearchType.any),
                    DropdownMenuEntry(label: "Routes", value: SearchType.route),
                    DropdownMenuEntry(
                        label: "Boulders", value: SearchType.boulder),
                    DropdownMenuEntry(label: "Areas", value: SearchType.area),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Difficulty"),
                    RangeSlider(
                      values: model.gradeRange,
                      max: 180,
                      divisions: 18,
                      labels: model.gradeLabels,
                      onChanged: (RangeValues values) {
                        model.setGradeRange(values);
                      },
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Shady only?"),
                    Checkbox(
                      value: model.shady,
                      onChanged: model.setShady,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
