---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: [OSI]
created: 2026-11-11
---
7-layer **Open Systems Interconnection** model, by ISO.

| # | Layer | Role |
|---|---|---|
| 7 | Application | access to the network for users, distributed info services |
| 6 | Presentation | independence from data representation (encoding, encryption, compression) |
| 5 | Session | establish, manage and close sessions between apps |
| 4 | Transport | reliable, transparent E2E transfer : error recovery, flow control |
| 3 | Network | independence from transmission and switching, connections |
| 2 | Data Link | reliable transfer over one physical link : sync, error & flow control |
| 1 | Physical | unstructured bit stream, mechanical & electrical properties |

## vs Internet stack
Application (Internet) = Application + Presentation + Session (OSI) ; the 4 lower layers match.

## Layers vs planes (ISO/IEC 7498-1)
Across the layers : **data / user plane** (traffic), **control / signalling plane** (decisions), **O&M plane** (operation & maintenance).

**Links** : [[Internet Protocol Stack]] [[Protocol Layering]]
