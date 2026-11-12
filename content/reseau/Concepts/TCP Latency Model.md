---
type: concept
course: Reseau
status: draft
source: "[[Transport Layer]]"
tags: [topic/performance]
aliases: [Latency modelling]
created: 2026-11-11
---
How long to get an object of size **O** from a server? Assumptions : one link of rate **R**, MSS of **S** bits, no loss, window of **W** segments.
Delay comes from : connection setup, transmission, and **idle time** caused by the window.

## Static window
| Case | Condition | Latency |
|---|---|---|
| 1. Window never empties | $WS/R > RTT + S/R$ (ACK comes back before the window is sent) | $2\,RTT + O/R$ |
| 2. Sender idles | $WS/R < RTT + S/R$ | $2\,RTT + O/R + (K-1)\,[S/R + RTT - WS/R]$ |

$K = O / (WS)$ = number of windows covering the object.

Pieces : 2 RTT (connection + request) + O/R (transmission) + idle time.

## Dynamic window (slow start)
$$Latency = 2\,RTT + \frac{O}{R} + P\left(RTT + \frac{S}{R}\right) - (2^P - 1)\frac{S}{R}$$
- K = number of windows covering the object
- Q = number of idles if the object were infinite
- **P = min(Q, K − 1)** = number of times the server idles

Example : O/S = 15 segments → windows 1 + 2 + 4 + 8 → K = 4, Q = 2 → P = 2 idles.

## When does slow start hurt?
$$\frac{Latency}{Minimum\ latency} \leq 1 + \frac{P}{(O/R)/RTT + 2}$$

| Slow start costs little | Slow start costs a lot |
|---|---|
| RTT ≪ O/R (big object, short RTT) | large RTT and **small** object (typical web page) |

**Links** : [[TCP Congestion Control]] [[HTTP Connections]] [[Nodal Delay]]
