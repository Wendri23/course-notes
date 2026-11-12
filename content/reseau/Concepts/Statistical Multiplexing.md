---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture, topic/performance]
aliases: []
created: 2026-11-10
---
The sequence of packets from different users follows no fixed pattern (opposite to [[Time Division Multiplexing|TDM]]) : packets are sent whenever they are ready.

```mermaid
flowchart LR
A[Host A] -- "10 Mbps Ethernet" --> R1
B[Host B] -- "10 Mbps Ethernet" --> R1
R1["Router<br/>queue of packets<br/>waiting for the output link"] -- "1.5 Mbps<br/>A B A A B ... (no fixed order)" --> R2[Router]
R2 --> C[Host C]
R2 --> R3[Router]
R3 --> D[Host D]
R3 --> E[Host E]
```
- Packets of A and B share the 1.5 Mbps link **on demand**, in the order they arrive
- Inputs faster than the output → a **queue** builds up → [[Queueing Delay]], possibly [[Packet Loss]]


**Links** : [[Packet Switching]] [[Time Division Multiplexing]] [[Frequency Division Multiplexing]]
