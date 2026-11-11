---
type: concept
course: Network
status: draft
source: "[[Link Layer]]"
tags: [topic/architecture, topic/protocol]
aliases: [Virtual LAN, IEEE 802.1Q]
created: 2026-11-11
---
**IEEE 802.1Q** : several logical LANs over one physical infrastructure.

## Why
- Restrict access to resources **regardless of the physical topology**
- Shrink the collision domain of a large Ethernet segment
- Interconnect distant LANs (**Metro-Ethernet**)

## Membership
| Based on | Mapping |
|---|---|
| Switch port | port ↔ VLAN |
| Layer 2 | MAC address ↔ VLAN |
| IP subnet | IP address ↔ VLAN |
| Higher protocols | |

Implemented by **frame tagging** and **frame filtering**.

## Tagged frame
| Preamble | Dest. | Source | **802.1Q tag (32 bits)** | Type | Payload | CRC |
|---|---|---|---|---|---|---|
| 64 | 48 | 48 | type `0x8100` (16) + priority (3) + CFI (1) + **VLAN ID (12)** | 16 | | 32 |

Scalability limit : 12-bit ID → **4 096** VLANs.

**Links** : [[Ethernet]] [[Link Layer Switches]] [[Local Area Network]]
