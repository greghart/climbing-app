import 'dart:convert' as convert;

import 'models/crag.dart';

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
        },
        {
          "id": 1445,
          "name": "20 Point Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.8506,
            "lng": -117.02412
          },
          "routes": [
            {
              "id": 1752,
              "name": "Traverse - left",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11d",
              "grade": {
                "system": "YDS",
                "raw": "5.11d",
                "value": 41
              }
            },
            {
              "id": 1753,
              "name": "The Ramp",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10d",
              "grade": {
                "system": "YDS",
                "raw": "5.10d",
                "value": 25
              }
            },
            {
              "id": 1754,
              "name": "Traverse - right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10d",
              "grade": {
                "system": "YDS",
                "raw": "5.10d",
                "value": 25
              }
            },
            {
              "id": 1755,
              "name": "Twenty Point Problem",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.12a",
              "grade": {
                "system": "YDS",
                "raw": "5.12a",
                "value": 50
              }
            },
            {
              "id": 1756,
              "name": "West Face - right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            },
            {
              "id": 1757,
              "name": "West Face - left",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            }
          ]
        },
        {
          "id": 1446,
          "name": "Suzie's Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85036,
            "lng": -117.02288
          },
          "routes": [
            {
              "id": 1758,
              "name": "Suzy's Discharge",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V8",
              "grade": {
                "system": "V",
                "raw": "V8",
                "value": 90
              }
            },
            {
              "id": 1759,
              "name": "Suzies face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              }
            },
            {
              "id": 1760,
              "name": "Mean Streak",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V11",
              "grade": {
                "system": "V",
                "raw": "V11",
                "value": 120
              }
            },
            {
              "id": 1761,
              "name": "N/a",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            },
            {
              "id": 1762,
              "name": "Suzie's Mantle",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1/2",
              "grade": {
                "system": "V",
                "raw": "V1/2",
                "value": 25
              }
            },
            {
              "id": 1763,
              "name": "Wall Flower",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V8",
              "grade": {
                "system": "V",
                "raw": "V8",
                "value": 90
              }
            }
          ]
        },
        {
          "id": 1447,
          "name": "Snow Cone Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85047,
            "lng": -117.02349
          },
          "routes": [
            {
              "id": 1764,
              "name": "Southeast Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10",
              "grade": {
                "system": "YDS",
                "raw": "5.10",
                "value": 11
              }
            },
            {
              "id": 1765,
              "name": "Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9+",
              "grade": {
                "system": "YDS",
                "raw": "5.9+",
                "value": 11
              }
            }
          ]
        },
        {
          "id": 1448,
          "name": "Round Rock",
          "description": null,
          "coordinates": {
            "lat": 32.85063,
            "lng": -117.02294
          },
          "routes": [
            {
              "id": 1766,
              "name": "Crack Direct",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1767,
              "name": "Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a",
              "grade": {
                "system": "YDS",
                "raw": "5.10a",
                "value": 11
              }
            },
            {
              "id": 1768,
              "name": "Round Rock Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a/10b",
              "grade": {
                "system": "YDS",
                "raw": "5.10a/10b",
                "value": 11.5
              }
            },
            {
              "id": 1769,
              "name": "Crack Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8",
              "grade": {
                "system": "YDS",
                "raw": "5.8",
                "value": 9
              }
            },
            {
              "id": 1770,
              "name": "Aréte",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a",
              "grade": {
                "system": "YDS",
                "raw": "5.10a",
                "value": 11
              }
            },
            {
              "id": 1771,
              "name": "Thin Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a",
              "grade": {
                "system": "YDS",
                "raw": "5.11a",
                "value": 30
              }
            }
          ]
        },
        {
          "id": 1449,
          "name": "Pile Unknown",
          "description": null,
          "coordinates": {
            "lat": 32.8502,
            "lng": -117.02333
          },
          "routes": [
            {
              "id": 1772,
              "name": "Unknown B",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1773,
              "name": "Unknown Black Face/Arete",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1774,
              "name": "The Outlander",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1/2",
              "grade": {
                "system": "V",
                "raw": "V1/2",
                "value": 25
              }
            },
            {
              "id": 1775,
              "name": "Unknown A",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            }
          ]
        },
        {
          "id": 1450,
          "name": "Easy Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85045,
            "lng": -117.02319
          },
          "routes": [
            {
              "id": 1776,
              "name": "Cool Down",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              }
            },
            {
              "id": 1777,
              "name": "Easy Boulder Corner",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            }
          ]
        },
        {
          "id": 1451,
          "name": "Dog Pile, The",
          "description": null,
          "coordinates": {
            "lat": 32.85048,
            "lng": -117.02311
          },
          "routes": [
            {
              "id": 1778,
              "name": "Big Nuthin",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10+",
              "grade": {
                "system": "YDS",
                "raw": "5.10+",
                "value": 12
              }
            },
            {
              "id": 1779,
              "name": "Kung Pao",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.12+",
              "grade": {
                "system": "YDS",
                "raw": "5.12+",
                "value": 51
              }
            },
            {
              "id": 1780,
              "name": "5.9 Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9-",
              "grade": {
                "system": "YDS",
                "raw": "5.9-",
                "value": 9
              }
            },
            {
              "id": 1781,
              "name": "Shockley's Lunge",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11",
              "grade": {
                "system": "YDS",
                "raw": "5.11",
                "value": 30
              }
            },
            {
              "id": 1782,
              "name": "The 5.8 Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8",
              "grade": {
                "system": "YDS",
                "raw": "5.8",
                "value": 9
              }
            },
            {
              "id": 1783,
              "name": "Epperson's Lunge",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.12",
              "grade": {
                "system": "YDS",
                "raw": "5.12",
                "value": 50
              }
            },
            {
              "id": 1784,
              "name": "Picket Mantel",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11",
              "grade": {
                "system": "YDS",
                "raw": "5.11",
                "value": 30
              }
            },
            {
              "id": 1785,
              "name": "Seam Slab",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.5",
              "grade": {
                "system": "YDS",
                "raw": "5.5",
                "value": -2
              }
            },
            {
              "id": 1786,
              "name": "The Hand Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1787,
              "name": "Mkay",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              }
            },
            {
              "id": 1788,
              "name": "Dog Pile Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0+",
              "grade": {
                "system": "V",
                "raw": "V0+",
                "value": 11
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
        "coordinates": [
          {
            "id": 1043,
            "order": 0,
            "lat": 32.850797100730674,
            "lng": -117.02266305685045
          },
          {
            "id": 1044,
            "order": 1,
            "lat": 32.85032390935391,
            "lng": -117.02254772186281
          },
          {
            "id": 1045,
            "order": 2,
            "lat": 32.849976900740515,
            "lng": -117.02298760414125
          },
          {
            "id": 1046,
            "order": 3,
            "lat": 32.8501053391517,
            "lng": -117.02358841896059
          },
          {
            "id": 1047,
            "order": 4,
            "lat": 32.85032841595034,
            "lng": -117.02408462762834
          },
          {
            "id": 1048,
            "order": 5,
            "lat": 32.85059430473533,
            "lng": -117.02423483133317
          },
          {
            "id": 1049,
            "order": 6,
            "lat": 32.850801607303076,
            "lng": -117.02378690242767
          },
          {
            "id": 1050,
            "order": 7,
            "lat": 32.850912018255634,
            "lng": -117.02277034521104
          }
        ]
      }
    },
    {
      "id": 227,
      "createdAt": "2024-12-26 18:36:56",
      "updatedAt": "2024-12-26 18:38:17",
      "name": "Hillside Area",
      "description": "",
      "boulders": [
        {
          "id": 1453,
          "name": "Bread Loaf Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85022,
            "lng": -117.0202
          },
          "routes": [
            {
              "id": 1794,
              "name": "The Bread Loaf",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11-",
              "grade": {
                "system": "YDS",
                "raw": "5.11-",
                "value": 29
              }
            }
          ]
        },
        {
          "id": 1454,
          "name": "Sunset Grill Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.84997,
            "lng": -117.02103
          },
          "routes": [
            {
              "id": 1795,
              "name": "Thin Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.6",
              "grade": {
                "system": "YDS",
                "raw": "5.6",
                "value": -1
              }
            }
          ]
        },
        {
          "id": 1455,
          "name": "Painted Crack Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85016,
            "lng": -117.02035
          },
          "routes": [
            {
              "id": 1796,
              "name": "No More Paint",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10+",
              "grade": {
                "system": "YDS",
                "raw": "5.10+",
                "value": 12
              }
            },
            {
              "id": 1797,
              "name": "Painted Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10",
              "grade": {
                "system": "YDS",
                "raw": "5.10",
                "value": 11
              }
            },
            {
              "id": 1798,
              "name": "10a Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a",
              "grade": {
                "system": "YDS",
                "raw": "5.10a",
                "value": 11
              }
            },
            {
              "id": 1799,
              "name": "The Painted Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10+",
              "grade": {
                "system": "YDS",
                "raw": "5.10+",
                "value": 12
              }
            },
            {
              "id": 1800,
              "name": "10d Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10c/d",
              "grade": {
                "system": "YDS",
                "raw": "5.10c/d",
                "value": 22.5
              }
            },
            {
              "id": 1801,
              "name": "The Painted Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8",
              "grade": {
                "system": "YDS",
                "raw": "5.8",
                "value": 9
              }
            }
          ]
        },
        {
          "id": 1456,
          "name": "Offwidth Rock",
          "description": null,
          "coordinates": {
            "lat": 32.85027,
            "lng": -117.02077
          },
          "routes": [
            {
              "id": 1802,
              "name": "11+ Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11+",
              "grade": {
                "system": "YDS",
                "raw": "5.11+",
                "value": 31
              }
            },
            {
              "id": 1803,
              "name": "Undercling",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9",
              "grade": {
                "system": "YDS",
                "raw": "5.9",
                "value": 10
              }
            },
            {
              "id": 1804,
              "name": "Offwidth Problem",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9",
              "grade": {
                "system": "YDS",
                "raw": "5.9",
                "value": 10
              }
            }
          ]
        },
        {
          "id": 1457,
          "name": "No Hands Traverse Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.84987,
            "lng": -117.02107
          },
          "routes": [
            {
              "id": 1805,
              "name": "No Hands Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            }
          ]
        },
        {
          "id": 1458,
          "name": "Lightbulb Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.8501,
            "lng": -117.02055
          },
          "routes": [
            {
              "id": 1806,
              "name": "The Lightbulb",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              }
            }
          ]
        },
        {
          "id": 1459,
          "name": "Gumdrop Boulder, The",
          "description": null,
          "coordinates": {
            "lat": 32.85009,
            "lng": -117.01999
          },
          "routes": [
            {
              "id": 1807,
              "name": "East arête",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            }
          ]
        },
        {
          "id": 1460,
          "name": "EB Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85042,
            "lng": -117.02059
          },
          "routes": [
            {
              "id": 1808,
              "name": "The Paint Stripe",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0+",
              "grade": {
                "system": "V",
                "raw": "V0+",
                "value": 11
              }
            },
            {
              "id": 1809,
              "name": "E. B. Boulder Right Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1810,
              "name": "E.B. Boulder Sit Start Right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            },
            {
              "id": 1811,
              "name": "E.B. Boulder Left Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1812,
              "name": "E.B. Boulder Sit Start Left",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            }
          ]
        },
        {
          "id": 1461,
          "name": "Donkey Dick Area, The",
          "description": null,
          "coordinates": {
            "lat": 32.84989,
            "lng": -117.02048
          },
          "routes": [
            {
              "id": 1813,
              "name": "West Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a/b",
              "grade": {
                "system": "YDS",
                "raw": "5.10a/b",
                "value": 11.5
              }
            },
            {
              "id": 1814,
              "name": "Donkey Dick, Right Arete",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10c",
              "grade": {
                "system": "YDS",
                "raw": "5.10c",
                "value": 20
              }
            },
            {
              "id": 1815,
              "name": "East Face - Arete",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a",
              "grade": {
                "system": "YDS",
                "raw": "5.11a",
                "value": 30
              }
            },
            {
              "id": 1816,
              "name": "South Face - Center",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a",
              "grade": {
                "system": "YDS",
                "raw": "5.11a",
                "value": 30
              }
            },
            {
              "id": 1817,
              "name": "West Face - Arete",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a/b",
              "grade": {
                "system": "YDS",
                "raw": "5.11a/b",
                "value": 30.5
              }
            },
            {
              "id": 1818,
              "name": "Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a/b",
              "grade": {
                "system": "YDS",
                "raw": "5.11a/b",
                "value": 30.5
              }
            }
          ]
        }
      ],
      "polygon": {
        "id": 192,
        "createdAt": "2024-12-26 18:38:17",
        "updatedAt": "2024-12-26 18:38:17",
        "descriptor": "area-Hillside Area-polygon",
        "coordinates": [
          {
            "id": 1014,
            "order": 0,
            "lat": 32.84982480238159,
            "lng": -117.02116638422014
          },
          {
            "id": 1015,
            "order": 1,
            "lat": 32.84955215133746,
            "lng": -117.02089816331865
          },
          {
            "id": 1016,
            "order": 2,
            "lat": 32.84983719559094,
            "lng": -117.02025040984157
          },
          {
            "id": 1017,
            "order": 3,
            "lat": 32.85008505941492,
            "lng": -117.01983466744424
          },
          {
            "id": 1018,
            "order": 4,
            "lat": 32.85030700961521,
            "lng": -117.02016457915309
          },
          {
            "id": 1019,
            "order": 5,
            "lat": 32.8505819116317,
            "lng": -117.02053472399712
          },
          {
            "id": 1020,
            "order": 6,
            "lat": 32.85053008590683,
            "lng": -117.02077478170396
          },
          {
            "id": 1021,
            "order": 7,
            "lat": 32.8502923631724,
            "lng": -117.02099069952968
          },
          {
            "id": 1022,
            "order": 8,
            "lat": 32.85002534682973,
            "lng": -117.02133134007455
          },
          {
            "id": 1023,
            "order": 9,
            "lat": 32.84986874193428,
            "lng": -117.02131927013399
          }
        ]
      }
    },
    {
      "id": 228,
      "createdAt": "2024-12-26 18:36:56",
      "updatedAt": "2024-12-26 18:46:36",
      "name": "Moby Dick Area",
      "description": "",
      "boulders": [
        {
          "id": 1462,
          "name": "Amphitheater, The",
          "description": null,
          "coordinates": {
            "lat": 32.85064,
            "lng": -117.0211
          },
          "routes": [
            {
              "id": 1819,
              "name": "One Cut Above",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V4",
              "grade": {
                "system": "V",
                "raw": "V4",
                "value": 50
              }
            },
            {
              "id": 1820,
              "name": "Thin Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10c",
              "grade": {
                "system": "YDS",
                "raw": "5.10c",
                "value": 20
              }
            },
            {
              "id": 1821,
              "name": "Beneath the Shelf",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1822,
              "name": "One Cut Above (right finish)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V5-6",
              "grade": {
                "system": "V",
                "raw": "V5-6",
                "value": 65
              }
            },
            {
              "id": 1823,
              "name": "Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9",
              "grade": {
                "system": "YDS",
                "raw": "5.9",
                "value": 10
              }
            },
            {
              "id": 1824,
              "name": "Walkman",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0+",
              "grade": {
                "system": "V",
                "raw": "V0+",
                "value": 11
              }
            },
            {
              "id": 1825,
              "name": "Jumpstart",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            },
            {
              "id": 1826,
              "name": "Amp Incline",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1827,
              "name": "Eastside Traverse (Left)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1828,
              "name": "Powell Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V4",
              "grade": {
                "system": "V",
                "raw": "V4",
                "value": 50
              }
            },
            {
              "id": 1829,
              "name": "Eastside Traverse (right)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1830,
              "name": "Amphitheatre Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            },
            {
              "id": 1831,
              "name": "Jumpstart Sit",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V7",
              "grade": {
                "system": "V",
                "raw": "V7",
                "value": 80
              }
            }
          ]
        },
        {
          "id": 1463,
          "name": "Triangle Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85024,
            "lng": -117.02143
          },
          "routes": [
            {
              "id": 1832,
              "name": "Triangle Boulder, Left Arete",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11b",
              "grade": {
                "system": "YDS",
                "raw": "5.11b",
                "value": 31
              }
            },
            {
              "id": 1833,
              "name": "Hold My Beer",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            }
          ]
        },
        {
          "id": 1464,
          "name": "Mudball Cracks",
          "description": null,
          "coordinates": {
            "lat": 32.85131,
            "lng": -117.0209
          },
          "routes": [
            {
              "id": 1834,
              "name": "Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1835,
              "name": "Left Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.6",
              "grade": {
                "system": "YDS",
                "raw": "5.6",
                "value": -1
              }
            },
            {
              "id": 1836,
              "name": "Center Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.6",
              "grade": {
                "system": "YDS",
                "raw": "5.6",
                "value": -1
              }
            },
            {
              "id": 1837,
              "name": "Right Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.4",
              "grade": {
                "system": "YDS",
                "raw": "5.4",
                "value": -3
              }
            }
          ]
        },
        {
          "id": 1465,
          "name": "Moby Dick",
          "description": null,
          "coordinates": {
            "lat": 32.85073,
            "lng": -117.02097
          },
          "routes": [
            {
              "id": 1838,
              "name": "East Buttress",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8",
              "grade": {
                "system": "YDS",
                "raw": "5.8",
                "value": 9
              }
            },
            {
              "id": 1839,
              "name": "Unnamed ('Puckerfest')",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            }
          ]
        },
        {
          "id": 1466,
          "name": "Lieback Rock",
          "description": "",
          "coordinates": {
            "lat": 32.85126,
            "lng": -117.02071
          },
          "polygon": {
            "id": 195,
            "descriptor": "boulder-Lieback Rock-polygon",
            "coordinates": [
              {
                "lat": 32.85130662362379,
                "lng": -117.0207328721881
              },
              {
                "lat": 32.851298737166815,
                "lng": -117.02074460685255
              },
              {
                "lat": 32.851272542858226,
                "lng": -117.02074259519578
              },
              {
                "lat": 32.8512362088045,
                "lng": -117.0207265019417
              },
              {
                "lat": 32.85122888566009,
                "lng": -117.02070806175473
              },
              {
                "lat": 32.85122888566009,
                "lng": -117.02068258076909
              },
              {
                "lat": 32.85124437692642,
                "lng": -117.02066447585821
              },
              {
                "lat": 32.851254798322245,
                "lng": -117.02066246420148
              },
              {
                "lat": 32.8512888790946,
                "lng": -117.0206829160452
              },
              {
                "lat": 32.851304370350434,
                "lng": -117.02071443200113
              }
            ]
          },
          "routes": [
            {
              "id": 1840,
              "name": "Penny Press",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-1",
              "grade": {
                "system": "V",
                "raw": "V0-1",
                "value": 15
              }
            },
            {
              "id": 1841,
              "name": "Mantle",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1842,
              "name": "Reverse Lieback aka Lieback Right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            },
            {
              "id": 1843,
              "name": "Unknown Slab",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            },
            {
              "id": 1844,
              "name": "Funky Like a Monkey (aka Lieback Rock Traverse)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V3",
              "grade": {
                "system": "V",
                "raw": "V3",
                "value": 40
              }
            },
            {
              "id": 1845,
              "name": "Lieback Rock Lieback",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11a",
              "grade": {
                "system": "YDS",
                "raw": "5.11a",
                "value": 30
              }
            },
            {
              "id": 1846,
              "name": "Flake",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1847,
              "name": "Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1848,
              "name": "Lieback Rock Dyno",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a",
              "grade": {
                "system": "YDS",
                "raw": "5.10a",
                "value": 11
              }
            },
            {
              "id": 1849,
              "name": "Another unknown slab",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2-3",
              "grade": {
                "system": "V",
                "raw": "V2-3",
                "value": 35
              }
            },
            {
              "id": 1850,
              "name": "Sloping Disappointment",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            }
          ]
        },
        {
          "id": 1467,
          "name": "Bullet Hole Wall",
          "description": null,
          "coordinates": {
            "lat": 32.85081,
            "lng": -117.02107
          },
          "routes": [
            {
              "id": 1851,
              "name": "Seam",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1852,
              "name": "Face left of American Express",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a",
              "grade": {
                "system": "YDS",
                "raw": "5.10a",
                "value": 11
              }
            },
            {
              "id": 1853,
              "name": "Friction Seam",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            },
            {
              "id": 1854,
              "name": "Bullet Hole Wall Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1855,
              "name": "Bullet Hole Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10+",
              "grade": {
                "system": "YDS",
                "raw": "5.10+",
                "value": 12
              }
            },
            {
              "id": 1856,
              "name": "Bullet Hole Wall Mantle",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10",
              "grade": {
                "system": "YDS",
                "raw": "5.10",
                "value": 11
              }
            },
            {
              "id": 1857,
              "name": "American Express",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9",
              "grade": {
                "system": "YDS",
                "raw": "5.9",
                "value": 10
              }
            }
          ]
        },
        {
          "id": 1468,
          "name": "Beehive Boulders",
          "description": null,
          "coordinates": {
            "lat": 32.85097,
            "lng": -117.02078
          },
          "routes": [
            {
              "id": 1858,
              "name": "Fingercrack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1859,
              "name": "Hollow Flake [Unknown]",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1860,
              "name": "Masochist Crack",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.9",
              "grade": {
                "system": "YDS",
                "raw": "5.9",
                "value": 10
              }
            },
            {
              "id": 1861,
              "name": "Unnamed (Slab)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1862,
              "name": "The Alien",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8-",
              "grade": {
                "system": "YDS",
                "raw": "5.8-",
                "value": 8
              }
            },
            {
              "id": 1863,
              "name": "The Knobs",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            },
            {
              "id": 1864,
              "name": "Iron Stem",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11c",
              "grade": {
                "system": "YDS",
                "raw": "5.11c",
                "value": 40
              }
            },
            {
              "id": 1865,
              "name": "Iron Cross",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            },
            {
              "id": 1866,
              "name": "Off-Width Problem",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.7",
              "grade": {
                "system": "YDS",
                "raw": "5.7",
                "value": 0
              }
            },
            {
              "id": 1867,
              "name": "Bear Hug",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11+",
              "grade": {
                "system": "YDS",
                "raw": "5.11+",
                "value": 31
              }
            },
            {
              "id": 1868,
              "name": "The Terrible Face",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11+",
              "grade": {
                "system": "YDS",
                "raw": "5.11+",
                "value": 31
              }
            },
            {
              "id": 1869,
              "name": "The Wrist-breaker",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.8",
              "grade": {
                "system": "YDS",
                "raw": "5.8",
                "value": 9
              }
            }
          ]
        },
        {
          "id": 1469,
          "name": "Animal Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85064,
            "lng": -117.02137
          },
          "routes": [
            {
              "id": 1870,
              "name": "Dead Animal Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2+",
              "grade": {
                "system": "V",
                "raw": "V2+",
                "value": 31
              }
            },
            {
              "id": 1871,
              "name": "Leopold and his Friction",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V6",
              "grade": {
                "system": "V",
                "raw": "V6",
                "value": 70
              }
            },
            {
              "id": 1872,
              "name": "North Face Traverse",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            },
            {
              "id": 1873,
              "name": "Ron's Pharmacy",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V6",
              "grade": {
                "system": "V",
                "raw": "V6",
                "value": 70
              }
            },
            {
              "id": 1874,
              "name": "Long Tall Texan",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V4",
              "grade": {
                "system": "V",
                "raw": "V4",
                "value": 50
              }
            }
          ]
        }
      ],
      "polygon": {
        "id": 194,
        "createdAt": "2024-12-26 18:46:36",
        "updatedAt": "2024-12-26 18:46:36",
        "descriptor": "area-Moby Dick Area-polygon",
        "coordinates": [
          {
            "id": 1035,
            "order": 0,
            "lat": 32.85002647348266,
            "lng": -117.02133134007455
          },
          {
            "id": 1036,
            "order": 1,
            "lat": 32.85029010987327,
            "lng": -117.0209960639477
          },
          {
            "id": 1037,
            "order": 2,
            "lat": 32.85053121255334,
            "lng": -117.02077612280846
          },
          {
            "id": 1038,
            "order": 3,
            "lat": 32.8505841649234,
            "lng": -117.02053338289262
          },
          {
            "id": 1039,
            "order": 4,
            "lat": 32.85142576537077,
            "lng": -117.02047437429431
          },
          {
            "id": 1040,
            "order": 5,
            "lat": 32.851660105172286,
            "lng": -117.02181547880174
          },
          {
            "id": 1041,
            "order": 6,
            "lat": 32.850980743371,
            "lng": -117.02155798673633
          },
          {
            "id": 1042,
            "order": 7,
            "lat": 32.85006928628311,
            "lng": -117.02154725790027
          }
        ]
      }
    },
    {
      "id": 229,
      "createdAt": "2024-12-26 18:36:56",
      "updatedAt": "2024-12-26 18:39:11",
      "name": "Synchronicity Area",
      "description": "",
      "boulders": [
        {
          "id": 1470,
          "name": "Carousel, The",
          "description": null,
          "coordinates": {
            "lat": 32.85122,
            "lng": -117.02249
          },
          "routes": [
            {
              "id": 1875,
              "name": "Blades edge",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            },
            {
              "id": 1876,
              "name": "no name: i'll call it 'two hands in the hole'",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1877,
              "name": "South Side Undercling",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            },
            {
              "id": 1878,
              "name": "Center North Side",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1879,
              "name": "no name SS",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V1",
              "grade": {
                "system": "V",
                "raw": "V1",
                "value": 20
              }
            },
            {
              "id": 1880,
              "name": "The Carousel",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            }
          ]
        },
        {
          "id": 1471,
          "name": "Undisclosed Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.8514,
            "lng": -117.02306
          },
          "routes": [
            {
              "id": 1881,
              "name": "Longbow",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0-",
              "grade": {
                "system": "V",
                "raw": "V0-",
                "value": 9
              }
            },
            {
              "id": 1882,
              "name": "Far North",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            }
          ]
        },
        {
          "id": 1472,
          "name": "Synchronicity Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85103,
            "lng": -117.02183
          },
          "routes": [
            {
              "id": 1883,
              "name": "Synchronicity (Aid Crack)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.12",
              "grade": {
                "system": "YDS",
                "raw": "5.12",
                "value": 50
              }
            }
          ]
        },
        {
          "id": 1473,
          "name": "Moon Boulder, The",
          "description": null,
          "coordinates": {
            "lat": 32.851,
            "lng": -117.02259
          },
          "routes": [
            {
              "id": 1884,
              "name": "The Black Spot Problem",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            },
            {
              "id": 1885,
              "name": "Unnamed",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10a/b",
              "grade": {
                "system": "YDS",
                "raw": "5.10a/b",
                "value": 11.5
              }
            },
            {
              "id": 1886,
              "name": "Unnamed*",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10c",
              "grade": {
                "system": "YDS",
                "raw": "5.10c",
                "value": 20
              }
            },
            {
              "id": 1887,
              "name": "NE face (left)",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2",
              "grade": {
                "system": "V",
                "raw": "V2",
                "value": 30
              }
            }
          ]
        },
        {
          "id": 1474,
          "name": "Lonesome Boulder",
          "description": null,
          "coordinates": {
            "lat": 32.85153,
            "lng": -117.02204
          },
          "routes": [
            {
              "id": 1888,
              "name": "The Flake Right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.11",
              "grade": {
                "system": "YDS",
                "raw": "5.11",
                "value": 30
              }
            },
            {
              "id": 1889,
              "name": "Kathleen Turner Overdrive",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V2-3",
              "grade": {
                "system": "V",
                "raw": "V2-3",
                "value": 35
              }
            },
            {
              "id": 1890,
              "name": "shelf right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1891,
              "name": "Uphill face right",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "VB",
              "grade": {
                "system": "V",
                "raw": "VB",
                "value": 0
              }
            },
            {
              "id": 1892,
              "name": "Left Shelf Mantle",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1893,
              "name": "ERMFP",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.12b",
              "grade": {
                "system": "YDS",
                "raw": "5.12b",
                "value": 60
              }
            },
            {
              "id": 1894,
              "name": "shelf center",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            },
            {
              "id": 1895,
              "name": "The Flake Left",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "5.10-",
              "grade": {
                "system": "YDS",
                "raw": "5.10-",
                "value": 10
              }
            },
            {
              "id": 1896,
              "name": "East corner",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0+",
              "grade": {
                "system": "V",
                "raw": "V0+",
                "value": 11
              }
            },
            {
              "id": 1897,
              "name": "Uphill face center",
              "length": null,
              "description": null,
              "firstAscent": null,
              "gradeRaw": "V0",
              "grade": {
                "system": "V",
                "raw": "V0",
                "value": 10
              }
            }
          ]
        }
      ],
      "polygon": {
        "id": 193,
        "createdAt": "2024-12-26 18:39:11",
        "updatedAt": "2024-12-26 18:39:11",
        "descriptor": "area-Synchronicity Area-polygon",
        "coordinates": [
          {
            "id": 1031,
            "order": 0,
            "lat": 32.85146181768821,
            "lng": -117.02323436737062
          },
          {
            "id": 1032,
            "order": 1,
            "lat": 32.850801607303076,
            "lng": -117.02266305685045
          },
          {
            "id": 1033,
            "order": 2,
            "lat": 32.850977363448536,
            "lng": -117.02156066894533
          },
          {
            "id": 1034,
            "order": 3,
            "lat": 32.851660105172286,
            "lng": -117.02181547880174
          }
        ]
      }
    }
  ],
  "trail": {
    "id": 11,
    "lines": [
      {
        "id": 132,
        "start": {
          "lat": 32.84855955926171,
          "lng": -117.02012702822688
        },
        "end": {
          "lat": 32.848632792881624,
          "lng": -117.0201498270035
        }
      },
      {
        "id": 133,
        "start": {
          "lat": 32.848632792881624,
          "lng": -117.0201498270035
        },
        "end": {
          "lat": 32.848782639946315,
          "lng": -117.02016323804858
        }
      },
      {
        "id": 134,
        "start": {
          "lat": 32.848782639946315,
          "lng": -117.02016323804858
        },
        "end": {
          "lat": 32.849056420020034,
          "lng": -117.02026247978212
        }
      },
      {
        "id": 135,
        "start": {
          "lat": 32.849056420020034,
          "lng": -117.02026247978212
        },
        "end": {
          "lat": 32.84918598642713,
          "lng": -117.02027723193169
        }
      },
      {
        "id": 136,
        "start": {
          "lat": 32.84918598642713,
          "lng": -117.02027723193169
        },
        "end": {
          "lat": 32.84920063305255,
          "lng": -117.02036842703819
        }
      },
      {
        "id": 137,
        "start": {
          "lat": 32.84920063305255,
          "lng": -117.02036842703819
        },
        "end": {
          "lat": 32.84925020622836,
          "lng": -117.020420730114
        }
      },
      {
        "id": 138,
        "start": {
          "lat": 32.84925020622836,
          "lng": -117.020420730114
        },
        "end": {
          "lat": 32.8492738661434,
          "lng": -117.02048107981685
        }
      },
      {
        "id": 139,
        "start": {
          "lat": 32.8492738661434,
          "lng": -117.02048107981685
        },
        "end": {
          "lat": 32.849363999095345,
          "lng": -117.02051997184755
        }
      },
      {
        "id": 140,
        "start": {
          "lat": 32.849363999095345,
          "lng": -117.02051997184755
        },
        "end": {
          "lat": 32.84945413195572,
          "lng": -117.02051460742952
        }
      },
      {
        "id": 141,
        "start": {
          "lat": 32.84945413195572,
          "lng": -117.02051460742952
        },
        "end": {
          "lat": 32.84948004513614,
          "lng": -117.02049717307094
        }
      },
      {
        "id": 142,
        "start": {
          "lat": 32.84948004513614,
          "lng": -117.02049717307094
        },
        "end": {
          "lat": 32.84953299813345,
          "lng": -117.020507901907
        }
      },
      {
        "id": 143,
        "start": {
          "lat": 32.84953299813345,
          "lng": -117.020507901907
        },
        "end": {
          "lat": 32.84960848426647,
          "lng": -117.02048644423488
        }
      },
      {
        "id": 144,
        "start": {
          "lat": 32.84960848426647,
          "lng": -117.02048644423488
        },
        "end": {
          "lat": 32.84969411025009,
          "lng": -117.02048912644388
        }
      },
      {
        "id": 145,
        "start": {
          "lat": 32.84969411025009,
          "lng": -117.02048912644388
        },
        "end": {
          "lat": 32.84974030318063,
          "lng": -117.02053606510164
        }
      },
      {
        "id": 146,
        "start": {
          "lat": 32.84974030318063,
          "lng": -117.02053606510164
        },
        "end": {
          "lat": 32.84979888930185,
          "lng": -117.02050387859346
        }
      },
      {
        "id": 147,
        "start": {
          "lat": 32.8492738661434,
          "lng": -117.02048107981685
        },
        "end": {
          "lat": 32.84926372618059,
          "lng": -117.020510584116
        }
      },
      {
        "id": 148,
        "start": {
          "lat": 32.84926372618059,
          "lng": -117.020510584116
        },
        "end": {
          "lat": 32.84927048615593,
          "lng": -117.02069967985155
        }
      },
      {
        "id": 149,
        "start": {
          "lat": 32.84927048615593,
          "lng": -117.02069967985155
        },
        "end": {
          "lat": 32.84926259951797,
          "lng": -117.02082440257075
        }
      },
      {
        "id": 150,
        "start": {
          "lat": 32.84926259951797,
          "lng": -117.02082440257075
        },
        "end": {
          "lat": 32.84925583954204,
          "lng": -117.0208901166916
        }
      },
      {
        "id": 151,
        "start": {
          "lat": 32.84925583954204,
          "lng": -117.0208901166916
        },
        "end": {
          "lat": 32.849267106168334,
          "lng": -117.02096521854402
        }
      },
      {
        "id": 152,
        "start": {
          "lat": 32.849267106168334,
          "lng": -117.02096521854402
        },
        "end": {
          "lat": 32.849308792673156,
          "lng": -117.02102825045588
        }
      },
      {
        "id": 153,
        "start": {
          "lat": 32.849308792673156,
          "lng": -117.02102825045588
        },
        "end": {
          "lat": 32.849434978730535,
          "lng": -117.0211932063103
        }
      },
      {
        "id": 154,
        "start": {
          "lat": 32.849434978730535,
          "lng": -117.0211932063103
        },
        "end": {
          "lat": 32.84962763745419,
          "lng": -117.02138632535936
        }
      },
      {
        "id": 155,
        "start": {
          "lat": 32.84962763745419,
          "lng": -117.02138632535936
        },
        "end": {
          "lat": 32.84970199684968,
          "lng": -117.02142521739009
        }
      },
      {
        "id": 156,
        "start": {
          "lat": 32.84970199684968,
          "lng": -117.02142521739009
        },
        "end": {
          "lat": 32.84983719559094,
          "lng": -117.02152445912363
        }
      },
      {
        "id": 157,
        "start": {
          "lat": 32.84983719559094,
          "lng": -117.02152445912363
        },
        "end": {
          "lat": 32.849885641756444,
          "lng": -117.0215392112732
        }
      },
      {
        "id": 158,
        "start": {
          "lat": 32.849885641756444,
          "lng": -117.0215392112732
        },
        "end": {
          "lat": 32.849992673888735,
          "lng": -117.0215164124966
        }
      },
      {
        "id": 159,
        "start": {
          "lat": 32.849992673888735,
          "lng": -117.0215164124966
        },
        "end": {
          "lat": 32.850208991067305,
          "lng": -117.0215740799904
        }
      },
      {
        "id": 160,
        "start": {
          "lat": 32.850208991067305,
          "lng": -117.0215740799904
        },
        "end": {
          "lat": 32.85027433677792,
          "lng": -117.02158078551295
        }
      },
      {
        "id": 161,
        "start": {
          "lat": 32.85027433677792,
          "lng": -117.02158078551295
        },
        "end": {
          "lat": 32.85033066924847,
          "lng": -117.02155396342278
        }
      },
      {
        "id": 162,
        "start": {
          "lat": 32.85033066924847,
          "lng": -117.02155396342278
        },
        "end": {
          "lat": 32.85050191973933,
          "lng": -117.02143862843515
        }
      },
      {
        "id": 163,
        "start": {
          "lat": 32.85050191973933,
          "lng": -117.02143862843515
        },
        "end": {
          "lat": 32.85054923889564,
          "lng": -117.02137291431428
        }
      },
      {
        "id": 164,
        "start": {
          "lat": 32.85054923889564,
          "lng": -117.02137291431428
        },
        "end": {
          "lat": 32.850579658339925,
          "lng": -117.02130988240243
        }
      },
      {
        "id": 165,
        "start": {
          "lat": 32.850579658339925,
          "lng": -117.02130988240243
        },
        "end": {
          "lat": 32.85060557119166,
          "lng": -117.02130854129793
        }
      },
      {
        "id": 166,
        "start": {
          "lat": 32.85060557119166,
          "lng": -117.02130854129793
        },
        "end": {
          "lat": 32.8506190909374,
          "lng": -117.02133670449258
        }
      },
      {
        "id": 167,
        "start": {
          "lat": 32.85060557119166,
          "lng": -117.02130854129793
        },
        "end": {
          "lat": 32.85071485574398,
          "lng": -117.0212495326996
        }
      },
      {
        "id": 168,
        "start": {
          "lat": 32.85071485574398,
          "lng": -117.0212495326996
        },
        "end": {
          "lat": 32.85073738862463,
          "lng": -117.02131122350694
        }
      },
      {
        "id": 169,
        "start": {
          "lat": 32.85071485574398,
          "lng": -117.0212495326996
        },
        "end": {
          "lat": 32.850728375473054,
          "lng": -117.02121600508693
        }
      },
      {
        "id": 170,
        "start": {
          "lat": 32.850728375473054,
          "lng": -117.02121600508693
        },
        "end": {
          "lat": 32.850844419729555,
          "lng": -117.02121734619142
        }
      },
      {
        "id": 171,
        "start": {
          "lat": 32.850844419729555,
          "lng": -117.02121734619142
        },
        "end": {
          "lat": 32.850881598925255,
          "lng": -117.02116638422014
        }
      },
      {
        "id": 172,
        "start": {
          "lat": 32.85080611387526,
          "lng": -117.02122002840044
        },
        "end": {
          "lat": 32.85082752008998,
          "lng": -117.02132597565652
        }
      },
      {
        "id": 173,
        "start": {
          "lat": 32.85082752008998,
          "lng": -117.02132597565652
        },
        "end": {
          "lat": 32.85080836716126,
          "lng": -117.02136889100076
        }
      },
      {
        "id": 174,
        "start": {
          "lat": 32.85045347391031,
          "lng": -117.02147215604784
        },
        "end": {
          "lat": 32.850670916610255,
          "lng": -117.0215553045273
        }
      },
      {
        "id": 175,
        "start": {
          "lat": 32.850670916610255,
          "lng": -117.0215553045273
        },
        "end": {
          "lat": 32.8506742965444,
          "lng": -117.02142521739009
        }
      },
      {
        "id": 176,
        "start": {
          "lat": 32.850670916610255,
          "lng": -117.0215553045273
        },
        "end": {
          "lat": 32.850717109032296,
          "lng": -117.02164381742479
        }
      },
      {
        "id": 177,
        "start": {
          "lat": 32.850717109032296,
          "lng": -117.02164381742479
        },
        "end": {
          "lat": 32.850776821152,
          "lng": -117.02167466282846
        }
      },
      {
        "id": 178,
        "start": {
          "lat": 32.850881598925255,
          "lng": -117.02116638422014
        },
        "end": {
          "lat": 32.850903005121786,
          "lng": -117.02114358544351
        }
      },
      {
        "id": 179,
        "start": {
          "lat": 32.850903005121786,
          "lng": -117.02114358544351
        },
        "end": {
          "lat": 32.85097060360324,
          "lng": -117.0211234688759
        }
      },
      {
        "id": 180,
        "start": {
          "lat": 32.85097060360324,
          "lng": -117.0211234688759
        },
        "end": {
          "lat": 32.850995389700195,
          "lng": -117.02129647135735
        }
      },
      {
        "id": 181,
        "start": {
          "lat": 32.850995389700195,
          "lng": -117.02129647135735
        },
        "end": {
          "lat": 32.85097173024415,
          "lng": -117.02152848243713
        }
      },
      {
        "id": 182,
        "start": {
          "lat": 32.85097173024415,
          "lng": -117.02152848243713
        },
        "end": {
          "lat": 32.850776821152,
          "lng": -117.02167466282846
        }
      },
      {
        "id": 183,
        "start": {
          "lat": 32.85097060360324,
          "lng": -117.0211234688759
        },
        "end": {
          "lat": 32.85107312786846,
          "lng": -117.02111676335336
        }
      },
      {
        "id": 184,
        "start": {
          "lat": 32.85107312786846,
          "lng": -117.02111676335336
        },
        "end": {
          "lat": 32.85116889218501,
          "lng": -117.02107720077039
        }
      },
      {
        "id": 185,
        "start": {
          "lat": 32.85116889218501,
          "lng": -117.02107720077039
        },
        "end": {
          "lat": 32.85121564766674,
          "lng": -117.02102221548559
        }
      },
      {
        "id": 186,
        "start": {
          "lat": 32.85121564766674,
          "lng": -117.02102221548559
        },
        "end": {
          "lat": 32.851275359450945,
          "lng": -117.0209075510502
        }
      },
      {
        "id": 187,
        "start": {
          "lat": 32.851275359450945,
          "lng": -117.0209075510502
        },
        "end": {
          "lat": 32.85123367386998,
          "lng": -117.02083177864552
        }
      },
      {
        "id": 188,
        "start": {
          "lat": 32.85123367386998,
          "lng": -117.02083177864552
        },
        "end": {
          "lat": 32.851230857275965,
          "lng": -117.0207265019417
        }
      },
      {
        "id": 189,
        "start": {
          "lat": 32.85097060360324,
          "lng": -117.0211234688759
        },
        "end": {
          "lat": 32.85096440707791,
          "lng": -117.02089682221414
        }
      },
      {
        "id": 190,
        "start": {
          "lat": 32.85096440707791,
          "lng": -117.02089682221414
        },
        "end": {
          "lat": 32.85081005712573,
          "lng": -117.02064134180547
        }
      },
      {
        "id": 191,
        "start": {
          "lat": 32.8508613193659,
          "lng": -117.02073119580746
        },
        "end": {
          "lat": 32.85075372495952,
          "lng": -117.02074930071834
        }
      },
      {
        "id": 192,
        "start": {
          "lat": 32.85075372495952,
          "lng": -117.02074930071834
        },
        "end": {
          "lat": 32.850715982388145,
          "lng": -117.02074728906156
        }
      },
      {
        "id": 193,
        "start": {
          "lat": 32.850715982388145,
          "lng": -117.02074728906156
        },
        "end": {
          "lat": 32.85067373322206,
          "lng": -117.02078282833101
        }
      },
      {
        "id": 194,
        "start": {
          "lat": 32.85067373322206,
          "lng": -117.02078282833101
        },
        "end": {
          "lat": 32.850643313810004,
          "lng": -117.02079556882383
        }
      },
      {
        "id": 195,
        "start": {
          "lat": 32.850643313810004,
          "lng": -117.02079556882383
        },
        "end": {
          "lat": 32.85033911911598,
          "lng": -117.02077008783819
        }
      },
      {
        "id": 196,
        "start": {
          "lat": 32.850776821152,
          "lng": -117.02167466282846
        },
        "end": {
          "lat": 32.85077456786519,
          "lng": -117.02186644077302
        }
      },
      {
        "id": 197,
        "start": {
          "lat": 32.85077456786519,
          "lng": -117.02186644077302
        },
        "end": {
          "lat": 32.8508128737331,
          "lng": -117.02199518680574
        }
      },
      {
        "id": 198,
        "start": {
          "lat": 32.8508128737331,
          "lng": -117.02199518680574
        },
        "end": {
          "lat": 32.850851179584474,
          "lng": -117.02217355370523
        }
      },
      {
        "id": 199,
        "start": {
          "lat": 32.850851179584474,
          "lng": -117.02217355370523
        },
        "end": {
          "lat": 32.85083991315931,
          "lng": -117.02222049236299
        }
      },
      {
        "id": 200,
        "start": {
          "lat": 32.85083991315931,
          "lng": -117.02222049236299
        },
        "end": {
          "lat": 32.85089624527081,
          "lng": -117.02234521508218
        }
      },
      {
        "id": 201,
        "start": {
          "lat": 32.85089624527081,
          "lng": -117.02234521508218
        },
        "end": {
          "lat": 32.85073400869288,
          "lng": -117.02249810099605
        }
      },
      {
        "id": 202,
        "start": {
          "lat": 32.85073400869288,
          "lng": -117.02249810099605
        },
        "end": {
          "lat": 32.85078132772542,
          "lng": -117.02229291200639
        }
      },
      {
        "id": 203,
        "start": {
          "lat": 32.85078132772542,
          "lng": -117.02229291200639
        },
        "end": {
          "lat": 32.85083991315931,
          "lng": -117.02222049236299
        }
      },
      {
        "id": 204,
        "start": {
          "lat": 32.85073400869288,
          "lng": -117.02249810099605
        },
        "end": {
          "lat": 32.85069570279093,
          "lng": -117.02260941267016
        }
      },
      {
        "id": 205,
        "start": {
          "lat": 32.85069570279093,
          "lng": -117.02260941267016
        },
        "end": {
          "lat": 32.850463613737176,
          "lng": -117.02289506793025
        }
      },
      {
        "id": 206,
        "start": {
          "lat": 32.850463613737176,
          "lng": -117.02289506793025
        },
        "end": {
          "lat": 32.8503554555242,
          "lng": -117.02306002378465
        }
      },
      {
        "id": 207,
        "start": {
          "lat": 32.8503554555242,
          "lng": -117.02306002378465
        },
        "end": {
          "lat": 32.85025856367975,
          "lng": -117.02313512563707
        }
      },
      {
        "id": 208,
        "start": {
          "lat": 32.85025856367975,
          "lng": -117.02313512563707
        },
        "end": {
          "lat": 32.85036446871364,
          "lng": -117.02339127659799
        }
      },
      {
        "id": 209,
        "start": {
          "lat": 32.85025856367975,
          "lng": -117.02313512563707
        },
        "end": {
          "lat": 32.85019209130672,
          "lng": -117.02324911952022
        }
      },
      {
        "id": 210,
        "start": {
          "lat": 32.85089624527081,
          "lng": -117.02234521508218
        },
        "end": {
          "lat": 32.85097173024415,
          "lng": -117.0223639905453
        }
      },
      {
        "id": 211,
        "start": {
          "lat": 32.85097173024415,
          "lng": -117.0223639905453
        },
        "end": {
          "lat": 32.85105172171297,
          "lng": -117.0224565267563
        }
      },
      {
        "id": 212,
        "start": {
          "lat": 32.85105172171297,
          "lng": -117.0224565267563
        },
        "end": {
          "lat": 32.85119367822659,
          "lng": -117.0224753022194
        }
      },
      {
        "id": 251,
        "start": {
          "lat": 32.85044220743467,
          "lng": -117.02292792499067
        },
        "end": {
          "lat": 32.8503999581382,
          "lng": -117.0229245722294
        }
      },
      {
        "id": 252,
        "start": {
          "lat": 32.8503999581382,
          "lng": -117.0229245722294
        },
        "end": {
          "lat": 32.85044220743467,
          "lng": -117.02292792499067
        }
      },
      {
        "id": 253,
        "start": {
          "lat": 32.85089624527081,
          "lng": -117.02234521508218
        },
        "end": {
          "lat": 32.85087371243049,
          "lng": -117.02265098690988
        }
      },
      {
        "id": 254,
        "start": {
          "lat": 32.85087371243049,
          "lng": -117.02265098690988
        },
        "end": {
          "lat": 32.85087371243049,
          "lng": -117.02278912067415
        }
      },
      {
        "id": 255,
        "start": {
          "lat": 32.85087371243049,
          "lng": -117.02278912067415
        },
        "end": {
          "lat": 32.85081850694756,
          "lng": -117.0228534936905
        }
      },
      {
        "id": 256,
        "start": {
          "lat": 32.85081850694756,
          "lng": -117.0228534936905
        },
        "end": {
          "lat": 32.85080836716126,
          "lng": -117.02290445566179
        }
      },
      {
        "id": 257,
        "start": {
          "lat": 32.85080836716126,
          "lng": -117.02290445566179
        },
        "end": {
          "lat": 32.85071034916717,
          "lng": -117.02294468879701
        }
      },
      {
        "id": 258,
        "start": {
          "lat": 32.85071034916717,
          "lng": -117.02294468879701
        },
        "end": {
          "lat": 32.85063261068105,
          "lng": -117.02291250228882
        }
      },
      {
        "id": 259,
        "start": {
          "lat": 32.85088385220934,
          "lng": -117.02257588505746
        },
        "end": {
          "lat": 32.85097173024415,
          "lng": -117.02258259058
        }
      },
      {
        "id": 260,
        "start": {
          "lat": 32.84979888930185,
          "lng": -117.02050387859346
        },
        "end": {
          "lat": 32.849832688969556,
          "lng": -117.02051863074306
        }
      },
      {
        "id": 261,
        "start": {
          "lat": 32.849832688969556,
          "lng": -117.02051863074306
        },
        "end": {
          "lat": 32.84985803871189,
          "lng": -117.02047638595106
        }
      },
      {
        "id": 262,
        "start": {
          "lat": 32.84985803871189,
          "lng": -117.02047638595106
        },
        "end": {
          "lat": 32.84988338844701,
          "lng": -117.0204482227564
        }
      },
      {
        "id": 263,
        "start": {
          "lat": 32.84988338844701,
          "lng": -117.0204482227564
        },
        "end": {
          "lat": 32.849904794884345,
          "lng": -117.02046029269697
        }
      },
      {
        "id": 264,
        "start": {
          "lat": 32.849904794884345,
          "lng": -117.02046029269697
        },
        "end": {
          "lat": 32.8499509877052,
          "lng": -117.0204944908619
        }
      },
      {
        "id": 265,
        "start": {
          "lat": 32.8499509877052,
          "lng": -117.0204944908619
        },
        "end": {
          "lat": 32.849952677685984,
          "lng": -117.02054277062417
        }
      },
      {
        "id": 266,
        "start": {
          "lat": 32.849952677685984,
          "lng": -117.02054277062417
        },
        "end": {
          "lat": 32.84998985725534,
          "lng": -117.020558193326
        }
      },
      {
        "id": 267,
        "start": {
          "lat": 32.84998985725534,
          "lng": -117.020558193326
        },
        "end": {
          "lat": 32.84999098390872,
          "lng": -117.02058300375941
        }
      },
      {
        "id": 268,
        "start": {
          "lat": 32.84999098390872,
          "lng": -117.02058300375941
        },
        "end": {
          "lat": 32.850102522521865,
          "lng": -117.02060848474505
        }
      },
      {
        "id": 269,
        "start": {
          "lat": 32.850102522521865,
          "lng": -117.02060848474505
        },
        "end": {
          "lat": 32.8501211122771,
          "lng": -117.02066279947759
        }
      },
      {
        "id": 270,
        "start": {
          "lat": 32.8501211122771,
          "lng": -117.02066279947759
        },
        "end": {
          "lat": 32.85006928628311,
          "lng": -117.02069766819477
        }
      },
      {
        "id": 271,
        "start": {
          "lat": 32.850102522521865,
          "lng": -117.02060848474505
        },
        "end": {
          "lat": 32.85013575874818,
          "lng": -117.02053673565388
        }
      },
      {
        "id": 272,
        "start": {
          "lat": 32.85013575874818,
          "lng": -117.02053673565388
        },
        "end": {
          "lat": 32.85020279448877,
          "lng": -117.02051930129531
        }
      },
      {
        "id": 273,
        "start": {
          "lat": 32.85020279448877,
          "lng": -117.02051930129531
        },
        "end": {
          "lat": 32.850293489821944,
          "lng": -117.02037177979948
        }
      },
      {
        "id": 274,
        "start": {
          "lat": 32.850293489821944,
          "lng": -117.02037177979948
        },
        "end": {
          "lat": 32.8501870213779,
          "lng": -117.02034898102283
        }
      },
      {
        "id": 275,
        "start": {
          "lat": 32.850214060994844,
          "lng": -117.02035434544086
        },
        "end": {
          "lat": 32.850219130922085,
          "lng": -117.02029399573804
        }
      },
      {
        "id": 276,
        "start": {
          "lat": 32.850219130922085,
          "lng": -117.02029399573804
        },
        "end": {
          "lat": 32.85016110840393,
          "lng": -117.02024638652803
        }
      },
      {
        "id": 277,
        "start": {
          "lat": 32.85016110840393,
          "lng": -117.02024638652803
        },
        "end": {
          "lat": 32.85018307809975,
          "lng": -117.02019810676576
        }
      },
      {
        "id": 278,
        "start": {
          "lat": 32.85016110840393,
          "lng": -117.02024638652803
        },
        "end": {
          "lat": 32.85009294597978,
          "lng": -117.02005863189699
        }
      },
      {
        "id": 279,
        "start": {
          "lat": 32.85009294597978,
          "lng": -117.02005863189699
        },
        "end": {
          "lat": 32.850087594382295,
          "lng": -117.01999928802255
        }
      },
      {
        "id": 280,
        "start": {
          "lat": 32.85020279448877,
          "lng": -117.02051930129531
        },
        "end": {
          "lat": 32.85025433874228,
          "lng": -117.02064067125323
        }
      },
      {
        "id": 281,
        "start": {
          "lat": 32.85025433874228,
          "lng": -117.02064067125323
        },
        "end": {
          "lat": 32.85033911911598,
          "lng": -117.02077008783819
        }
      },
      {
        "id": 282,
        "start": {
          "lat": 32.85036446871364,
          "lng": -117.02339127659799
        },
        "end": {
          "lat": 32.8503824950898,
          "lng": -117.02345464378597
        }
      },
      {
        "id": 283,
        "start": {
          "lat": 32.8503824950898,
          "lng": -117.02345464378597
        },
        "end": {
          "lat": 32.8504100979712,
          "lng": -117.0234975591302
        }
      },
      {
        "id": 284,
        "start": {
          "lat": 32.8504100979712,
          "lng": -117.0234975591302
        },
        "end": {
          "lat": 32.85044981230589,
          "lng": -117.02348951250315
        }
      },
      {
        "id": 285,
        "start": {
          "lat": 32.8504100979712,
          "lng": -117.0234975591302
        },
        "end": {
          "lat": 32.850439954139354,
          "lng": -117.02372219413519
        }
      },
      {
        "id": 286,
        "start": {
          "lat": 32.850439954139354,
          "lng": -117.02372219413519
        },
        "end": {
          "lat": 32.85051431285413,
          "lng": -117.02387005090715
        }
      },
      {
        "id": 287,
        "start": {
          "lat": 32.85051431285413,
          "lng": -117.02387005090715
        },
        "end": {
          "lat": 32.85049741315171,
          "lng": -117.02400751411915
        }
      },
      {
        "id": 288,
        "start": {
          "lat": 32.85049741315171,
          "lng": -117.02400751411915
        },
        "end": {
          "lat": 32.85053290252311,
          "lng": -117.02412217855455
        }
      },
      {
        "id": 289,
        "start": {
          "lat": 32.85097173024415,
          "lng": -117.02152848243713
        },
        "end": {
          "lat": 32.851106927050814,
          "lng": -117.02162504196168
        }
      },
      {
        "id": 290,
        "start": {
          "lat": 32.851106927050814,
          "lng": -117.02162504196168
        },
        "end": {
          "lat": 32.85112495327614,
          "lng": -117.02184364199641
        }
      },
      {
        "id": 291,
        "start": {
          "lat": 32.85112495327614,
          "lng": -117.02184364199641
        },
        "end": {
          "lat": 32.85106524139072,
          "lng": -117.02194958925249
        }
      },
      {
        "id": 292,
        "start": {
          "lat": 32.85106524139072,
          "lng": -117.02194958925249
        },
        "end": {
          "lat": 32.851064114750976,
          "lng": -117.02205017209054
        }
      },
      {
        "id": 293,
        "start": {
          "lat": 32.851064114750976,
          "lng": -117.02205017209054
        },
        "end": {
          "lat": 32.85092553795465,
          "lng": -117.02235460281373
        }
      },
      {
        "id": 294,
        "start": {
          "lat": 32.85111932008112,
          "lng": -117.02173501253131
        },
        "end": {
          "lat": 32.851270289584036,
          "lng": -117.02176451683046
        }
      },
      {
        "id": 295,
        "start": {
          "lat": 32.851270289584036,
          "lng": -117.02176451683046
        },
        "end": {
          "lat": 32.851360702167085,
          "lng": -117.02186677604915
        }
      },
      {
        "id": 296,
        "start": {
          "lat": 32.851360702167085,
          "lng": -117.02186677604915
        },
        "end": {
          "lat": 32.851521529306744,
          "lng": -117.02195897698404
        }
      }
    ]
  },
  "defaultZoom": 18,
  "minZoom": 17,
  "maxZoom": 22
}
''';
