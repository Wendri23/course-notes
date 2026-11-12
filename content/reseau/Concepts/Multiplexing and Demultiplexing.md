---
type: concept
course: Reseau
status: draft
source: "[[Transport Layer]]"
tags: [topic/architecture]
aliases: [MUX, DEMUX]
created: 2026-11-11
---
| Multiplexing (sender) | Demultiplexing (receiver) |
|---|---|
| gather data from several [[Socket\|sockets]], add a header | read the header, deliver the segment to the right socket |
| school : collect letters before sending | school : hand out received letters |

## Connectionless (UDP) — 2-tuple
UDP socket identified by **(destination IP, destination port)**.
- Receiver only looks at the destination port
- Segments from **different sources** reach the **same socket**
- Source IP + port are used only as return address

```mermaid
flowchart LR
A["Client A<br/>port 6428"] -- "src 6428 → dst 9157" --> S["Server B<br/>one socket : 9157"]
C["Client C<br/>port 5775"] -- "src 5775 → dst 9157" --> S
```

## Connection-oriented (TCP) — 4-tuple
TCP socket identified by **(source IP, source port, destination IP, destination port)**.
- Receiver uses all 4 values
- Server has **one socket per connection** (per process or thread)

```mermaid
flowchart LR
A["Client A : 9157"] --> S1["socket (A, 9157, B, 80)"]
C1["Client C : 9157"] --> S2["socket (C, 9157, B, 80)"]
C2["Client C : 5775"] --> S3["socket (C, 5775, B, 80)"]
S1 --- B[Server B port 80]
S2 --- B
S3 --- B
```
Same destination port 80, but 3 different sockets because the 4-tuples differ.

| | UDP | TCP |
|---|---|---|
| Socket ID | 2-tuple | 4-tuple |
| Sockets on server | 1 for all clients | 1 per connection (+ 1 listening) |

**Links** : [[Socket]] [[UDP]] [[TCP Segment Structure]]
