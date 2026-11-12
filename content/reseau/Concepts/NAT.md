---
type: concept
course: Reseau
status: draft
source: "[[Network Layer]]"
tags: [topic/addressing]
aliases: [NAT-P, Network Address Translation, Carrier-Grade NAT, CGN, Masquerading]
created: 2026-11-11
---
Context : IPv4 address shortage. The whole local network uses **one public IP address** seen from outside (Linux : masquerading + IP forwarding).

## How it works
```mermaid
sequenceDiagram
participant H as Host 10.0.0.1:3345
participant N as NAT router 138.76.29.7
participant S as Server 128.119.40.186:80
H->>N: src 10.0.0.1:3345 → dst 128.119.40.186:80
Note over N: table : 138.76.29.7:5001 ↔ 10.0.0.1:3345
N->>S: src 138.76.29.7:5001 → dst 128.119.40.186:80
S->>N: src 128.119.40.186:80 → dst 138.76.29.7:5001
N->>H: src 128.119.40.186:80 → dst 10.0.0.1:3345
```
| Direction | Action |
|---|---|
| Outgoing | replace (source IP, port) by (NAT IP, **new port**), store in the **NAT translation table** |
| Incoming | replace (NAT IP, new port) by the stored (private IP, port) |

> Example addresses are the classic Kurose & Ross figure (the slide is a diagram).

## Pros and cons
| Pros | Cons |
|---|---|
| one address for all devices | routers should stop at layer 3, NAT reads **ports** (layer 4) |
| change local addresses without telling the outside | **violates the E2E principle** |
| change ISP without renumbering devices | inside hosts can't be servers without tricks (passive FTP, STUN, TURN, P2P connection reversal) |
| hides the topology (security plus) | "push" services must poll (RSS) |
| | the real fix is IPv6 |

## Scale
- Residential NAT : 16-bit port field → 60 000+ connections behind one address
- **Carrier-Grade NAT** (RFC 6598) : the ISP itself does NAT, using 100.64.0.0/10 internally

**Links** : [[IP Addressing]] [[DHCP]] [[Multiplexing and Demultiplexing]] [[IPv4 to IPv6 Transition]]
