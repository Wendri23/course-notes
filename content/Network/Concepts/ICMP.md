---
type: concept
course: Network
status: draft
source: "[[Network Layer]]"
tags: [topic/protocol]
aliases: [Internet Control Message Protocol, ICMPv6, ping]
created: 2026-11-11
---
Used by hosts and routers to exchange **network-level information** :
- error reporting (unreachable host, network, port, protocol)
- echo request / reply (**ping**)

Sits "above" IP : ICMP messages are carried as **IP payload**. A message = type + code + first 8 bytes of the datagram that caused the error.

## Main messages
| Type | Code | Meaning |
|---|---|---|
| 0 | 0 | echo reply (ping) |
| 3 | 0 / 1 / 2 / 3 | destination network / host / protocol / **port** unreachable |
| 3 | 6 / 7 | destination network / host unknown |
| 4 | 0 | source quench (congestion control, rarely used) |
| 8 | 0 | echo request (ping) |
| 9 / 10 | 0 | route advertisement / router discovery |
| 11 | 0 | **TTL expired** |
| 12 | 0 | bad IP header |

[[Traceroute]] relies on type 11 (TTL expired, from each router) and type 3 code 3 (port unreachable, from the destination).

## ICMPv6
- Replaces **ARP** (link layer) with neighbor discovery
- Probes the path MTU (PMTU)
- Extra messages : neighbor / router discovery (RS, RA, NS, NA), mobility, multicast

**Links** : [[Traceroute]] [[IPv6]] [[IP Forwarding]]
