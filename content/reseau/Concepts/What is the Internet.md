---
type: concept
course: Reseau
status: to-review
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: []
created: 2026-11-10
---
## Nuts and Bolts view
- Tons of connected devices (hosts / end systems) running network apps
- Communication links (radio, fiber, copper, sat) — transmission rate = bandwidth
- Routers : forward packets (chunks of data)
- [[What is a Protocol|Protocols]] : TCP, IP, HTTP...
- Network of networks (loosely hierarchical, public Internet vs private intranets)
- Internet Standards : RFC, IETF

## Service view
- Distributed apps running on end systems (web, mail, P2P...)
- 2 kinds of service : connection-oriented reliable / connectionless unreliable (see [[The Network edge]])
- [[Best Effort]] : no guarantee how long it takes

## Original assumptions (1960s)
- [[Best Effort]]
- Mutual trust
- Wired networks
- E2E paradigm : intelligence and control placed at the edge of the network, not in the core
- → no longer true today, but hard to change (**ossification**)

**Links** : [[What is a Protocol]] [[The Network edge]]
