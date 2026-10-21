// Sources: Kimodo-Policy paper Tables 1–3 and Figure 11.
window.KIMODO_RESULTS = {
  "multi": {
    "tasks": [
      "Football",
      "DoubleDesk",
      "P&P Box",
      "OpenDoor",
      "SitSofa",
      "Boxing",
      "VisNavi"
    ],
    "models": [
      {
        "name": "ACT",
        "values": [
          20,
          30,
          60,
          58.3,
          21.7,
          58.3,
          28.3
        ],
        "mean": 39.5,
        "color": "#9ba5b1",
        "sd": [
          4.1,
          4.1,
          12.2,
          2.4,
          2.4,
          10.3,
          4.7
        ]
      },
      {
        "name": "DP",
        "values": [
          53.3,
          35,
          0,
          83.3,
          83.3,
          21.7,
          50
        ],
        "mean": 46.7,
        "color": "#d29555",
        "sd": [
          6.2,
          10.8,
          0,
          6.2,
          4.7,
          30.6,
          14.7
        ]
      },
      {
        "name": "FM",
        "values": [
          21.7,
          20,
          0,
          76.7,
          48.3,
          18.3,
          38.3
        ],
        "mean": 31.9,
        "color": "#987eb3",
        "sd": [
          8.5,
          7.1,
          0,
          2.4,
          6.2,
          25.9,
          6.2
        ]
      },
      {
        "name": "π₀.₅",
        "values": [
          10,
          30,
          75,
          85,
          70,
          71.7,
          35
        ],
        "mean": 53.8,
        "color": "#4fa9a0",
        "sd": [
          7.1,
          7.1,
          4.1,
          4.1,
          14.7,
          12.5,
          4.1
        ]
      },
      {
        "name": "Kimodo (scratch)",
        "values": [
          35,
          40,
          80,
          93.3,
          96.7,
          66.7,
          61.7
        ],
        "mean": 67.63,
        "color": "#6E89BC",
        "sd": [
          7.1,
          0,
          4.1,
          6.2,
          4.7,
          4.7,
          6.2
        ]
      },
      {
        "name": "Kimodo (pretrained)",
        "values": [
          40,
          38.3,
          90,
          95,
          96.7,
          68.3,
          76.7
        ],
        "mean": 72.14,
        "color": "#76B900",
        "sd": [
          4.1,
          2.4,
          4.1,
          4.1,
          4.7,
          10.3,
          8.5
        ]
      }
    ],
    "value": 72.14,
    "eyebrow": "HumanoidArena · Multi-task · SONIC",
    "title": "Mean success across seven tasks.",
    "description": "One policy learns all seven tasks. VLA pretraining improves overall success from 67.63% to 72.14%, with the lowest reported average fall rate (4.3%).",
    "note": "Table 2 · RTC disabled. Task values are mean ± standard deviation (%). Overall values follow the paper; rounded task means may differ slightly.",
    "chart": "radar"
  },
  "single": {
    "tasks": [
      "Football",
      "DoubleDesk",
      "P&P Box",
      "OpenDoor",
      "SitSofa",
      "Boxing",
      "VisNavi"
    ],
    "models": [
      {
        "name": "ACT",
        "values": [
          16.7,
          18.3,
          56.7,
          78.3,
          73.3,
          56.7,
          33.3
        ],
        "mean": 47.61,
        "color": "#9ba5b1",
        "sd": [
          6.2,
          4.7,
          6.2,
          9.4,
          8.5,
          6.2,
          2.4
        ]
      },
      {
        "name": "DP",
        "values": [
          45,
          36.7,
          75,
          85,
          78.3,
          76.7,
          23.3
        ],
        "mean": 60,
        "color": "#d29555",
        "sd": [
          10.8,
          4.7,
          4.1,
          10.8,
          14.3,
          2.4,
          6.2
        ]
      },
      {
        "name": "FM",
        "values": [
          13.3,
          38.3,
          73.3,
          70,
          15,
          70,
          38.3
        ],
        "mean": 45.46,
        "color": "#987eb3",
        "sd": [
          2.4,
          4.7,
          6.2,
          4.1,
          14.7,
          8.2,
          14.3
        ]
      },
      {
        "name": "π₀.₅",
        "values": [
          10,
          43.3,
          71.7,
          66.7,
          73.3,
          70,
          23.3
        ],
        "mean": 51.19,
        "color": "#4fa9a0",
        "sd": [
          4.1,
          6.2,
          11.8,
          6.2,
          2.4,
          0,
          6.2
        ]
      },
      {
        "name": "Kimodo (scratch)",
        "values": [
          28.3,
          40,
          80,
          90,
          100,
          73.3,
          75
        ],
        "mean": 69.51,
        "color": "#6E89BC",
        "sd": [
          6.2,
          0,
          4.1,
          4.1,
          0,
          13.1,
          10.8
        ]
      },
      {
        "name": "Kimodo (pretrained)",
        "values": [
          26.7,
          28.3,
          78.3,
          93.3,
          96.7,
          70,
          76.7
        ],
        "mean": 67.14,
        "color": "#76B900",
        "sd": [
          4.7,
          2.4,
          8.5,
          2.4,
          2.4,
          8.2,
          18.9
        ]
      }
    ],
    "value": 69.51,
    "eyebrow": "HumanoidArena · Single-task · SONIC",
    "title": "Mean success across seven tasks.",
    "description": "Separate task-specific policies achieve 69.51% mean success without VLA pretraining. Pretraining improves selected tasks, while its aggregate is 67.14%.",
    "note": "Table 1 · RTC disabled. Task values are mean ± standard deviation (%). Overall values follow the paper; rounded task means may differ slightly.",
    "chart": "radar"
  },
  "simple": {
    "tasks": [
      "Handover",
      "Mobile P&P",
      "XMoveBendPick",
      "CloseDoor",
      "OpenOven",
      "OpenFaucet",
      "Push Office Chair",
      "OpenTrashCan"
    ],
    "models": [
      {
        "name": "Ψ₀",
        "values": [
          80.0,
          60.0,
          93.33333333333333,
          100.0,
          53.333333333333336,
          33.33333333333333,
          100.0,
          83.33333333333334
        ],
        "mean": 75.41666666666667,
        "color": "#987eb3",
        "sd": null,
        "counts": [
          [
            7,
            7,
            10
          ],
          [
            7,
            5,
            6
          ],
          [
            10,
            9,
            9
          ],
          [
            10,
            10,
            10
          ],
          [
            7,
            5,
            4
          ],
          [
            3,
            3,
            4
          ],
          [
            10,
            10,
            10
          ],
          [
            7,
            9,
            9
          ]
        ]
      },
      {
        "name": "Kimodo (pretrained)",
        "values": [
          83.33333333333334,
          70.0,
          80.0,
          100.0,
          56.666666666666664,
          53.333333333333336,
          100.0,
          63.33333333333333
        ],
        "mean": 75.83333333333333,
        "color": "#76B900",
        "sd": null,
        "counts": [
          [
            9,
            8,
            8
          ],
          [
            9,
            8,
            4
          ],
          [
            10,
            7,
            7
          ],
          [
            10,
            10,
            10
          ],
          [
            8,
            4,
            5
          ],
          [
            5,
            6,
            5
          ],
          [
            10,
            10,
            10
          ],
          [
            9,
            4,
            6
          ]
        ]
      },
      {
        "name": "ACT",
        "values": [
          46.666666666666664,
          60.0,
          73.33333333333333,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "DreamZero",
        "values": [
          80.0,
          36.666666666666664,
          3.3333333333333335,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "π₀.₅",
        "values": [
          46.666666666666664,
          30.0,
          0.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "EgoVLA",
        "values": [
          23.333333333333332,
          0.0,
          40.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "GR00T N1.6",
        "values": [
          23.333333333333332,
          0.0,
          30.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "InternVLA-M1",
        "values": [
          0.0,
          0.0,
          50.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "DP",
        "values": [
          30.0,
          13.333333333333334,
          0.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      },
      {
        "name": "H-RDT",
        "values": [
          3.3333333333333335,
          0.0,
          0.0,
          null,
          null,
          null,
          null,
          null
        ],
        "mean": null,
        "color": "#9ba5b1",
        "sd": null
      }
    ],
    "value": 75.83333333333333,
    "eyebrow": "SIMPLE · L0–L2 · Single-task",
    "title": "Six of eight tasks best or joint-best.",
    "description": "Task-specific policies are evaluated under increasing visual, lighting, and target-pose variation. Kimodo-Policy completes 182 of 240 trials across the eight tasks.",
    "note": "Table 3 · RTC disabled. Percentages are calculated from L0/L1/L2 success counts (30 trials per task). 75.83% is the calculated eight-task aggregate. Only Ψ₀ and Kimodo have all eight results; missing entries are not zero.",
    "chart": "radar"
  },
  "real": {
    "tasks": [
      "Single-Arm PNP",
      "Dual-Arm PNP",
      "Football Scoring",
      "Banana Cabinet",
      "Cart Pushing",
      "Punching Bag",
      "Box Carrying",
      "Cushion Sitting"
    ],
    "models": [
      {
        "name": "GR00T N1.6",
        "values": [
          20,
          40,
          20,
          30,
          30,
          50,
          20,
          40
        ],
        "mean": 31,
        "color": "#b4bbc3",
        "sd": null
      },
      {
        "name": "Ψ₀",
        "values": [
          10,
          70,
          0,
          10,
          50,
          60,
          30,
          50
        ],
        "mean": 35,
        "color": "#987eb3",
        "sd": null
      },
      {
        "name": "Kimodo (scratch)",
        "values": [
          30,
          50,
          20,
          20,
          60,
          80,
          30,
          70
        ],
        "mean": 45,
        "color": "#6E89BC",
        "sd": null
      },
      {
        "name": "Kimodo (pretrained)",
        "values": [
          40,
          70,
          50,
          40,
          60,
          90,
          50,
          80
        ],
        "mean": 60,
        "color": "#76B900",
        "sd": null
      }
    ],
    "value": 60,
    "eyebrow": "RealWorld · Eight tasks",
    "title": "Mean success on the physical robot.",
    "description": "VLA pretraining raises mean success from 45% to 60%. It improves seven of eight tasks and matches the scratch-trained policy on Cart Pushing.",
    "note": "Figure 11 · Ten trials per task and policy. RTC enabled for real-world deployment. Means follow the paper’s plotted summary (GR00T N1.6: 31%, rounded from task values).",
    "chart": "radar"
  }
};
