---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture, topic/physical]
aliases: []
created: 2026-11-10
---
## Nuts and Bolts
### End systems, Clients and Servers
End systems (hosts) run app programs at the edge of the network (web, mail)
### Two models
- Client/server : client host requests, receives service from an always-on server
- P2P : minimal (or no) use of dedicated servers

## Two approaches
### Connection-oriented service
Goal : transfer data between hosts
1. Handshaking : set up the data transfer ahead of time ("state" in both hosts)
2. Optional features :
	- reliable, in-order byte stream (loss → acknowledgements + retransmissions)
	- **flow control** : sender doesn't overwhelm the receiver
	- **congestion control** : sender slows down when the network is congested
3. TCP = connection-oriented service

### Connectionless service
Goal : transfer data between hosts
1. No handshaking → data delivered sooner
2. Unreliable, no flow control, no congestion control
3. UDP (User Datagram Protocol) = connectionless service

## Summary
| | Connection-oriented (TCP) | Connectionless (UDP) |
|---|---|---|
| Handshake | yes | no → faster |
| Reliable, in order | yes | no |
| Flow control | yes | no |
| Congestion control | yes | no |
| Used by | Web, mail, FTP, SSH | streaming, VoIP, DNS |

**Links** : [[What is the Internet]]
