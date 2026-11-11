---
title: Network
type: course
course: Network
aliases: [Network]
color: "#0f766e"
description: "From the Internet's edge down to the link layer, plus the cryptography that secures it."
created: 2026-11-10
---
## Chapters
| # | Chapter | Topic |
|---|---|---|
| 1 | [[Computer Networks and the Internet]] | overview : edge, core, access, delays, layers |
| 2 | [[Cryptography Basics]] | symmetric / public key, hash, certificates |
| 3 | [[Application Layer]] | HTTP, DNS, FTP, e-mail, CDN, P2P |
| 4 | [[Transport Layer]] | UDP, TCP, reliability, flow and congestion control |
| 5 | [[Network Layer]] | IP, addressing, NAT, routing (LS / DV), RIP, OSPF, BGP |
| 6 | [[Link Layer]] | error detection, multiple access, ARP, Ethernet, switches |

## Course map
```mermaid
flowchart TD
C1[1. Internet overview] --> C3[3. Application layer]
C2[2. Cryptography] --> C3
C3 --> C4[4. Transport layer]
C4 --> C5[5. Network layer and routing]
C5 --> C6[6. Link layer and LANs]
```

## Key concepts
**Basics** : [[What is the Internet]] · [[What is a Protocol]] · [[Packet Switching]] · [[Circuit Switching]] · [[Nodal Delay]] · [[Internet Protocol Stack]]

**Security** : [[Symmetric Key Cryptography]] · [[Public Key Cryptography]] · [[Hash Functions]] · [[Certification Authority]] · [[HTTPS and TLS]]

**Application** : [[HTTP]] · [[DNS]] · [[Electronic Mail]] · [[Content Distribution Network]] · [[Peer-to-Peer]]

**Transport** : [[UDP]] · [[TCP Segment Structure]] · [[Reliable Data Transfer]] · [[TCP Congestion Control]] · [[QUIC]]

**Network** : [[Network Layer Services]] · [[IP Addressing]] · [[IPv6]] · [[NAT]] · [[Routing Algorithms]] · [[Autonomous Systems]] · [[BGP]]

**Link** : [[Link Layer Services]] · [[Error Detection]] · [[Multiple Access Protocols]] · [[Random Access Protocols]] · [[MAC Address and ARP]] · [[Ethernet]] · [[Link Layer Switches]]
