---
type: concept
course: Network
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/performance]
aliases: [Traffic intensity]
created: 2026-11-11
---
Varies from packet to packet : with 10 packets arriving at an empty queue, the 1st is sent without delay, the last waits the longest.

## Traffic intensity = La / R
(L = packet length, a = packet arrival rate, R = transmission rate)
- La/R ≈ 0 → small delay
- La/R → 1 → delay becomes large (∝ 1 / (1 − La/R))
- La/R > 1 → more work arriving than can be served → average delay **infinite** (congestion)

→ Design rule : never have traffic intensity > 1.

## M/M/1 model (simplest queue)
- Single server
- Poisson arrivals at rate λ (exponential inter-arrival time)
- Exponential service time, mean 1/µ
- M = Markov (memoryless)

**Links** : [[Nodal Delay]] [[Packet Loss]]
