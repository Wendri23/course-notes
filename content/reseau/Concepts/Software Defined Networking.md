---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: [SDN]
created: 2026-11-11
---
## Basic ideas
- **Decouple** the software controlling the network (control plane) from the devices implementing it (data plane)
- Generic network hardware offering a standard set of packet-processing functions instead of fixed specialised features

## Benefits
- Network evolves without changing the hardware
- Network algorithms expressed with abstractions suited to each application

## Protocols (RFC 7426)
- Control ↔ forwarding : OpenFlow, ForCES
- Management : NETCONF/YANG, SNMP, syslog
- Next step : programmable data plane

**Links** : [[Network Function Virtualisation]] [[OSI Model]] [[What is the Internet]] [[IP Forwarding]] [[Routing Algorithms]]
