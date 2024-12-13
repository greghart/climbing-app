import 'models/crag.dart';
import 'dart:convert' as convert;

/// TODO: For now, this Data class is very dumb and just parses a json string into a crag
/// Long term, we will want to fetch this data from a server, allow re-syncing it, etc.
class Data {
  Data() {
    crag = Crag.fromJson(convert.jsonDecode(cragJson));
  }

  late final Crag crag;
}

const cragJson = '''
{
  "id": 55,
  "name": "Santee",
  "description": "It's not great, but it is Santee",
  "bounds": {
    "topLeft": {
      "lat": 32.85220989996955,
      "lng": -117.02677488327026
    },
    "bottomRight": {
      "lat": 32.846910096797295,
      "lng": -117.01915740966798
    }
  },
  "center": {
    "lat": 32.85052,
    "lng": -117.02223
  },
  "areas": [
    {
      "id": 226,
      "createdAt": "2024-12-09 23:22:49",
      "updatedAt": "2024-12-09 23:22:49",
      "name": "Dog Pile Area",
      "description": "Dog Pile Boulder and surrounding area",
      "boulders": [
        {
          "id": 1444,
          "name": "Butt Plug",
          "description": "Name speaks for itself",
          "coordinates": {
            "lat": 32.85039094495237,
            "lng": -117.0234227925539
          },
          "polygon": {
            "id": 191,
            "descriptor": "boulder-Butt Plug-polygon",
            "coordinates": [
              {
                "lat": 32.85039460655923,
                "lng": -117.02344458550215
              },
              {
                "lat": 32.85040052146229,
                "lng": -117.02342547476293
              },
              {
                "lat": 32.85040023980026,
                "lng": -117.02341172844173
              },
              {
                "lat": 32.8503931982489,
                "lng": -117.02340200543405
              },
              {
                "lat": 32.850383058413996,
                "lng": -117.02340468764308
              },
              {
                "lat": 32.85037883348243,
                "lng": -117.02341541647914
              },
              {
                "lat": 32.850381086779294,
                "lng": -117.02343251556158
              },
              {
                "lat": 32.85038812833159,
                "lng": -117.02344693243505
              }
            ]
          },
          "routes": [
            {
              "id": 1457,
              "name": "Butt Plug Mantle",
              "length": null,
              "description": "Mantling a butt plug is a one step process",
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              },
              "coordinates": {
                "lat": 32.85038260809142,
                "lng": -117.023405831197
              }
            },
            {
              "id": 1458,
              "name": "The Butt Plug North Side",
              "length": null,
              "description": "",
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              },
              "coordinates": {
                "lat": 32.850400405315625,
                "lng": -117.0234198063049
              }
            },
            {
              "id": 1459,
              "name": "East Face of Butt Plug",
              "length": null,
              "description": "",
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              },
              "coordinates": {
                "lat": 32.85039152132756,
                "lng": -117.02340244901657
              }
            }
          ]
        }
      ],
      "polygon": {
        "id": 190,
        "createdAt": "2024-12-09 23:22:49",
        "updatedAt": "2024-12-09 23:22:49",
        "descriptor": "area-Dog Pile Area-polygon",
        "coordinates": []
      }
    }
  ],
  "defaultZoom": 18,
  "minZoom": 17,
  "maxZoom": 22
}
''';
