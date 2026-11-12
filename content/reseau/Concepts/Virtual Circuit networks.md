---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: []
created: 2026-11-10
---
- Forward packets according to the virtual circuit (VC) number stored in the packet (tag → next hop)
- Fixed path determined at session setup, remains fixed
- Routers maintain per-session state (VC translation tables, updated at each connection setup/release)
- VC number is not unique : it changes on each link (shorter field, decentralised allocation)
- VC = predetermined route **≠** dedicated path : packets can still be queued and delayed

**Links** : [[Packet Switching]] [[Datagram networks]] [[Circuit Switching]] [[Network Layer Services]]
