---
type: concept
course: Reseau
status: draft
source: "[[Transport Layer]]"
tags: [topic/protocol]
aliases: [User Datagram Protocol, Checksum]
created: 2026-11-11
---
"No frills" transport : [[Best Effort]] IP + ports + error check.
- Segments may be **lost** or delivered **out of order**
- **Connectionless** : no handshake, each segment handled independently

## Segment format (8-byte header)
| Bits 0–15 | Bits 16–31 |
|---|---|
| source port | destination port |
| length (header + data) | checksum |
| application data (message) | |

## Pros and cons
| Pros | Cons |
|---|---|
| no connection setup → no delay | no congestion control → can starve TCP flows |
| no connection state (buffers, parameters) | some middleboxes block UDP (2–4 %) |
| small header : 8 B vs 20 B for TCP | reliability / congestion control must be done by the app |
| sends as fast as it wants | |

## Uses
- Streaming multimedia (loss tolerant, rate sensitive), DNS, SNMP
- **Reliable transfer over UDP** : add reliability at the application layer (app-specific error recovery) — e.g. [[QUIC]]

## Checksum
Goal : detect flipped bits.
- Sender : segment = sequence of 16-bit words → **1's complement sum** → complement → checksum field
- Receiver : adds all words **+ checksum** → must give all 1s, else error

Example :
```
  0110011001100110
+ 0101010101010101
+ 0000111100001111
= 1100101011001010   (sum, carry wrapped around)
  0011010100110101   checksum = 1's complement
```
Receiver : sum + checksum = `1111111111111111` → no error detected.
- Any **one-bit** error is detected
- Some **two-bit** errors are not (two flips that cancel out) → "no error detected" ≠ "no error"

**Links** : [[Multiplexing and Demultiplexing]] [[Transport Layer Services]] [[Reliable Data Transfer]] [[Error Detection]]
