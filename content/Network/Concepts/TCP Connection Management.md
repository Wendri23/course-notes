---
type: concept
course: Network
status: draft
source: "[[Transport Layer]]"
tags: [topic/protocol, topic/reliability]
aliases: [Three-way handshake, TIME_WAIT, SYN, FIN]
created: 2026-11-11
---
Before exchanging data, both hosts initialise TCP variables : sequence numbers, buffers, flow control info.

## Opening : three-way handshake
```mermaid
sequenceDiagram
participant C as Client
participant S as Server
C->>S: SYN (client ISN, no data)
S->>C: SYNACK (server ISN, buffers allocated)
C->>S: ACK (may already carry data)
```
ISN = Initial Sequence Number.

## Closing : 4 segments
Full duplex → the two directions are closed independently.
```mermaid
sequenceDiagram
participant C as Client
participant S as Server
C->>S: FIN
S->>C: ACK
S->>C: FIN
C->>S: ACK
Note over C: TIME_WAIT (2 MSL), re-ACKs any FIN
Note over S: closed on ACK receipt
```

## State diagram (simplified)
```mermaid
stateDiagram-v2
[*] --> CLOSED
CLOSED --> LISTEN : server passive open
LISTEN --> SYN_RCVD : rcv SYN / send SYNACK
SYN_RCVD --> ESTABLISHED : rcv ACK
CLOSED --> SYN_SENT : client active open / send SYN
SYN_SENT --> ESTABLISHED : rcv SYNACK / send ACK
ESTABLISHED --> FIN_WAIT_1 : active close / send FIN
FIN_WAIT_1 --> FIN_WAIT_2 : rcv ACK
FIN_WAIT_2 --> TIME_WAIT : rcv FIN / send ACK
TIME_WAIT --> CLOSED : 2 MSL timeout
ESTABLISHED --> CLOSE_WAIT : passive close, rcv FIN / send ACK
CLOSE_WAIT --> LAST_ACK : send FIN
LAST_ACK --> CLOSED : rcv ACK
```

## TIME_WAIT (2MSL wait)
**MSL** = Maximum Segment Lifetime (30–120 s).
| Why wait | Side effect |
|---|---|
| resend the last ACK if it was lost | the socket 4-tuple can't be reused (issue for busy servers) |
| old delayed segments are not mistaken for a new connection | |

## Full HTTP example
SYN → SYNACK → ACK → GET → object → FIN/ACK exchanges ; sockets `IP_Client:49997 ↔ IP_Server:80`.

**Links** : [[TCP Segment Structure]] [[HTTP Connections]]
