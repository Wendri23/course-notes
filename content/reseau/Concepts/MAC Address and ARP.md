---
type: concept
course: Reseau
status: draft
source: "[[Link Layer]]"
tags: [topic/addressing, topic/protocol]
aliases: [MAC address, ARP, Address Resolution Protocol, Neighbour Discovery, LAN address]
created: 2026-11-11
---
## Two kinds of addresses
| | IP address | MAC (LAN, physical, Ethernet) address |
|---|---|---|
| Size | 128 bits (IPv6), 32 bits (IPv4) | **48 bits**, burned in the adapter ROM |
| Goal | reach the destination **IP network** | go from one interface to another **on the same link** |
| Structure | **hierarchical** → not portable | **flat** → portable |
| Allocation | ISP / registries | IEEE ; a manufacturer buys blocks of 2²⁴ addresses |
| Analogy | postal address (changes) | ID number (permanent) |

## From name to MAC address
```mermaid
flowchart LR
N["www.info.unamur.be"] -- DNS --> C["CNAME leibniz.info.unamur.be"]
C -- "DNS AAAA" --> I6["2001:6a8:3900:20::100"]
C -- "DNS A" --> I4["138.48.32.100"]
I6 -- "ICMPv6 ND" --> M["00:03:BA:07:3B:19"]
I4 -- ARP --> M
```

## Address resolution : ND (IPv6) and ARP (IPv4)
Each node keeps a table of `<IP address ; MAC address ; TTL>` (TTL typically **20 min**, **soft state**).
Linux : `ip -6 neigh show` (IPv6), `arp -a` (IPv4).

```mermaid
sequenceDiagram
participant A
participant L as All nodes on the LAN
participant B
A->>L: query with B's IP (ICMPv6 multicast / ARP broadcast)
B->>A: reply with B's MAC (unicast)
Note over A: cache IP ↔ MAC until TTL expires
```
**Plug-and-play** : tables are built without any admin.

## Sending to a node off the LAN (A → B via router R)
| Step | Who | Action |
|---|---|---|
| 1 | A | builds datagram **src A, dst B** (IP), but must give it to R |
| 2 | A | ARP for **R's MAC** (R's interface 111.111.111.110) |
| 3 | A | frame : dst MAC = **R**, payload = A→B datagram |
| 4 | R | extracts datagram, sees dst = B, ARP for **B's MAC** (R has one ARP table per LAN) |
| 5 | R | new frame dst MAC = B, **same** A→B datagram |

IP addresses stay the same end to end, MAC addresses change at every hop.

**Links** : [[IP Addressing]] [[IP Forwarding]] [[ICMP]] [[IPv6]] [[Ethernet]] [[DNS Records]]
