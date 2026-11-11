---
type: concept
course: Network
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/physical]
aliases: [FDM]
created: 2026-11-10
---
The link bandwidth is split into **frequency bands** : each circuit gets its own band, all the time.

Example with 4 circuits (C1 to C4) : each one keeps **its own band** for the whole time.

| Frequency ↓ / Time → | t1 | t2 | t3 | t4 | t5 | t6 |
|---|---|---|---|---|---|---|
| Band 1 | C1 | C1 | C1 | C1 | C1 | C1 |
| Band 2 | C2 | C2 | C2 | C2 | C2 | C2 |
| Band 3 | C3 | C3 | C3 | C3 | C3 | C3 |
| Band 4 | C4 | C4 | C4 | C4 | C4 | C4 |

| FDM | [[Time Division Multiplexing\|TDM]] |
|---|---|
| splits the **frequencies** | splits the **time** |
| narrow band, all the time | full band, during its slot |


**Links** : [[Circuit Switching]] [[Time Division Multiplexing]] [[Statistical Multiplexing]] [[Multiple Access Protocols]]
