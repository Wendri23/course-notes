---
type: concept
course: Network
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: []
created: 2026-11-10
---
## Approach
- E2E resources along the path are reserved for every ongoing call during the whole duration (dedicated → no sharing)
- Resources are divided into "pieces" (using [[Frequency Division Multiplexing|FDM]] or [[Time Division Multiplexing|TDM]]) and reserved to a specific user
- Guaranteed performance, at the cost of resource waste (an idle piece cannot be shared)
- Examples : PSTN (telephone), MPLS

```mermaid
flowchart LR 
A["Host A"] ===|"reserved circuit"| S1(("Switch 1")) 
S1 ===|"1 circuit out of 4"| S2(("Switch 2")) 
S2 ===|"1 circuit out of 4"| S3(("Switch 3")) 
S3 ===|"reserved circuit"| B["Host B"] 
linkStyle 0,1,2,3 stroke:#D85A30,stroke-width:4px
```

**Links** : [[Packet Switching]]
