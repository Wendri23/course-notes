---
type: concept
course: Network
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/protocol, topic/routing]
aliases: []
created: 2026-11-11
---
Tool measuring the real delay to each router on the path to a destination.

1. Sends UDP datagrams to the destination with an unlikely port number and **increasing TTL** (1, 2, 3...)
2. Each router where the TTL expires answers with ICMP **"time exceeded"** → gives its address + RTT
3. The destination answers with ICMP **"port unreachable"** → end

```mermaid
sequenceDiagram
participant S as Source
participant R1 as Router 1
participant R2 as Router 2
participant D as Destination
S->>R1: UDP, TTL=1
R1-->>S: ICMP time exceeded (RTT 1)
S->>R2: UDP, TTL=2
R2-->>S: ICMP time exceeded (RTT 2)
S->>D: UDP, TTL=3, unlikely port
D-->>S: ICMP port unreachable (end)
```

- 3 probes per hop, `* * *` = no answer
- Big jump in RTT = long link (e.g. intercontinental cable)
- Large-scale measurements : RIPE Atlas

**Links** : [[Nodal Delay]] [[ICMP]]
