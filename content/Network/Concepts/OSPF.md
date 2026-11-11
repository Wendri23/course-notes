---
type: concept
course: Network
status: draft
source: "[[Network Layer]]"
tags: [topic/protocol, topic/routing]
aliases: [Open Shortest Path First]
created: 2026-11-11
---
Intra-AS protocol based on **link state**, successor of [[RIP]].
- Link state information **flooded** to the entire AS
- Each router runs [[Dijkstra Algorithm|Dijkstra]] → shortest path tree → routing table
- Messages carried **directly over IP** (protocol 89), not over TCP or UDP

## OSPF vs RIP
| | RIP | OSPF |
|---|---|---|
| Algorithm | distance vector | link state (Dijkstra) |
| Link cost | always 1 (hops) | **policy** : 1 (= RIP), inverse of capacity, ... |
| Transport | UDP 520 | IP directly (protocol 89) |
| Security | none | all messages **authenticated**, only trusted routers |
| Equal-cost paths | one path chosen | **several** allowed (load sharing) |
| Multicast | no | integrated (MOSPF, same topology database) |
| Hierarchy | no | **areas** |

## Hierarchy with areas
```mermaid
flowchart TD
subgraph Backbone area
BR[Backbone router] --- ABR1[Area border router 1]
BR --- ABR2[Area border router 2]
BR --- GW[AS boundary router] --> O((other ASs))
end
subgraph Area 1
ABR1 --- r1[router] --- r2[router]
end
subgraph Area 2
ABR2 --- r3[router] --- r4[router]
end
```
- Each area runs OSPF **internally**, its structure is invisible from outside
- **Area border routers** route packets out of the area
- The **backbone area** carries traffic between areas and to other ASs

> The intra vs inter-AS slide writes "OSPF (TCP 89)" : 89 is the IP protocol number, OSPF does not use TCP.

**Links** : [[Dijkstra Algorithm]] [[RIP]] [[Autonomous Systems]] [[BGP]]
