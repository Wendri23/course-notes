---
type: concept
course: Reseau
status: draft
source: "[[Link Layer]]"
tags: [topic/protocol]
aliases: [IEEE 802.3, Ethernet frame, Manchester encoding, 10BaseT, Gigabit Ethernet]
created: 2026-11-11
---
**Dominant LAN technology**, beat token ring, FDDI and ATM :
- mass deployment → cheap hardware
- simpler (fully decentralised) and cheaper than token LANs and ATM
- kept up with speed : **10 Mbps → 100 Gbps**
- versatile : bus or star, over coax, twisted pair or fiber

## Frame structure
| Field | Size | Role |
|---|---|---|
| Preamble | 8 B | clock sync : 7 × `10101010` + `10101011` |
| Destination address | 6 B | adapter keeps the frame if it matches (or broadcast), else drops |
| Source address | 6 B | |
| Type | 2 B | upper protocol : `0x0800` IP, `0x0806` ARP, `0x0810` VLAN |
| Data | **46 – 1 500 B** | network-layer PDU |
| CRC | 4 B | error → frame **dropped** |

Error checks at each layer : Ethernet CRC (whole frame) · IPv4 header checksum · TCP checksum (segment).

## Service
| Property | Meaning |
|---|---|
| **Connectionless** | no handshake between adapters |
| **Unreliable** | CRC OK → pass up, no ACK ; CRC fails → drop, no NAK |
| Gaps | datagram stream may have gaps → filled by TCP, otherwise seen by the app |

## Physical layer : Manchester encoding
- **Baseband** : digital signal sent directly on the medium (≠ xDSL, cable modem)
- **One transition in the middle of each bit** → receivers sync their clocks, no global clock

## MAC protocol
[[Random Access Protocols|CSMA/CD]] without slots, random backoff before retransmitting.
Efficiency = 1 / (1 + 5 t_prop / t_trans).

## Generations
| Standard | Rate | Medium / topology | Notes |
|---|---|---|---|
| 10BaseT / 100BaseT | 10 / 100 Mbps | twisted pair, **star** around a hub | max **100 m** node ↔ hub ; Manchester (10) / 4B5B (100) |
| Gigabit (802.3z) | 1 Gbps | full-duplex point-to-point with **switches**, or shared via "buffered distributors" | same frame format, backward compatible |
| 802.3ae | 10 Gbps | | |

Hub = physical-layer **repeater** : bits in on one link go out on all others, no buffering, no CSMA/CD (adapters detect collisions), offers management features.

**Links** : [[Local Area Network]] [[Random Access Protocols]] [[Error Detection]] [[VLAN]] [[Link Layer Switches]] [[MAC Address and ARP]]
