---
type: concept
course: Reseau
status: draft
source: "[[Transport Layer]]"
tags: [topic/architecture]
aliases: [Transport layer]
created: 2026-11-11
---
The transport layer gives **logical communication between processes** on remote hosts : the hosts look directly connected.
- Sender : splits app messages into **segments** → network layer
- Receiver : reassembles segments into messages → application

## Transport vs network layer
| Network layer | Transport layer |
|---|---|
| logical communication between **hosts** | logical communication between **processes** |
| best effort (IP) | relies on and **enhances** the network layer |

School analogy : kids = processes, schools = hosts, letters = messages, Alice & Bob (who collect and hand out letters) = transport, postal service = network.

## Transport protocols
| Protocol | Reliable | Connection | In order | Flow / congestion control |
|---|---|---|---|---|
| IP (reference) | no | — | no | no |
| [[TCP Segment Structure\|TCP]] | yes | yes | yes | yes / yes |
| SCTP | yes | yes | possibly | yes / yes |
| [[UDP]] | no (error check only) | no | no | no / no |
| DCCP | no | yes | no | no / yes |
| [[QUIC]] | yes | yes | per stream | yes / yes |

MPTCP = TCP over several paths at once (multiplexing).

Never available on the Internet : **delay** and **bandwidth** guarantees.

**Links** : [[Multiplexing and Demultiplexing]] [[The Network edge]] [[Protocol Layering]]
