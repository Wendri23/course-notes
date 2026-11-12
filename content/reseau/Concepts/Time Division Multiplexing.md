---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/physical]
aliases: [TDM]
created: 2026-11-10
---
Time is split into **slots** : each circuit gets the full bandwidth, but only during its own periodic slot (fixed pattern).

Example with 4 circuits (C1 to C4) : each one gets the **whole band** during its slot, in a repeating frame.

| Time → | t1 | t2 | t3 | t4 | t5 | t6 | t7 | t8 |
|---|---|---|---|---|---|---|---|---|
| Whole band | C1 | C2 | C3 | C4 | C1 | C2 | C3 | C4 |
| | frame 1 | | | | frame 2 | | | |

Each slot can be split again into **downlink** and **uplink** parts.

| [[Frequency Division Multiplexing\|FDM]] | TDM |
|---|---|
| splits the **frequencies** | splits the **time** |
| narrow band, all the time | full band, during its slot |


**Links** : [[Circuit Switching]] [[Frequency Division Multiplexing]] [[Statistical Multiplexing]] [[Multiple Access Protocols]]
