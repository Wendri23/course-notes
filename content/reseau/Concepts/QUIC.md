---
type: concept
course: Reseau
status: draft
source: "[[Application Layer]]"
tags: [topic/performance, topic/protocol]
aliases: [HTTP/3]
created: 2026-11-11
---
On top of **UDP**, QUIC re-implements almost all TCP features (reliability, congestion control) in a more efficient way, and integrates TLS. It runs in **user space**, not in the kernel → easier to update (fights ossification).

## Protocol stacks
| HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|
| HTTP/1 | HTTP/2 | HTTP/3 |
| TLS 1.2/1.3 | TLS 1.2/1.3 | QUIC (includes TLS 1.3) |
| TCP | TCP | UDP |
| IP | IP | IP |
| issue : HTTP HoL blocking | issue : TCP HoL blocking | independent streams |

**Head-of-line (HoL) blocking** : one lost/slow item blocks everything queued behind it. HTTP/2 removed it at the HTTP level, but a lost TCP segment still blocks all streams → QUIC streams are independent.

- Hybrid between TCP (reliable) and UDP (lightweight)

## As a transport protocol (RFC 9000, 2021)
| Mechanism | Benefit |
|---|---|
| no transport handshake (UDP) + TLS session resumption | **low-latency** connection setup |
| independent streams | multiplexing without head-of-line blocking |
| header + payload encrypted and authenticated | privacy, middleboxes can't tamper (fights ossification) |
| rich signalling | better loss recovery and congestion control (e.g. BBR) |
| stream + connection flow control | |
| **Connection ID** instead of 4-tuple | connection survives IP change (WiFi → 4G) and NAT rebinding = **migration** |
| version negotiation, user space | easy to evolve |

## Setup latency before first data
| Stack | Round trips |
|---|---|
| TCP + TLS 1.2 | 3 RTT |
| TCP + TLS 1.3 | 2 RTT |
| QUIC, first connection | 1 RTT |
| QUIC, known server | **0 RTT** |

> RTT counts completed from general knowledge (the slide is a diagram).

## Packet format
- **Long header** during the handshake : types Initial (0x00), 0-RTT (0x01), Handshake (0x02), Retry (0x03)
- **Short header** once the handshake is done
- Metadata carried in **frames** inside the encrypted payload (STREAM, ACK...) instead of one big fixed header like TCP
- Debugging : qlog / qvis (structured logs, since packets are encrypted)

**Links** : [[HTTP]] [[HTTP Connections]] [[The Network edge]] [[Transport Layer Services]] [[TCP Congestion Control]] [[HTTPS and TLS]]
