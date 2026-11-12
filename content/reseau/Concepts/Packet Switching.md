---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: []
created: 2026-11-10
---
## Approach
- No resource reservation → [[Best Effort]] (restaurant analogy)
- Each E2E data stream is divided into packets; packets of all users share the links via [[Statistical Multiplexing]]
- Each packet uses the full link bandwidth
- Store and forward : the whole packet is received before being sent on the next hop → delay = L/R per hop
- Congestion : packets queue → queueing delays or packet loss
- THIS IS THE INTERNET

## Message segmentation (vs message switching)
- Whole message (7.5 Mb, 3 links of 1.5 Mbps) : 3 × 5 s = 15 s
- Split into 5000 packets : 5.002 s → links work in parallel (**pipelining**)
- Pros : lower delay, a lost/corrupted packet costs less · Cons : header overhead per packet, reordering

## Two classes to handle forwarding
| | [[Datagram networks]] | [[Virtual Circuit networks]] |
|---|---|---|
| Forwarding key | destination address | VC number (tag) |
| Path | may change | fixed at setup |
| State in routers | none | per session |
| Analogy | postal service | reserved route |

**Links** : [[Circuit Switching]]
