---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: [TCP/IP stack, 5 layers]
created: 2026-11-11
---
| Layer          | Role                                           | Protocols             | PDU      |
| -------------- | ---------------------------------------------- | --------------------- | -------- |
| 5. Application | support network apps                           | HTTP, SMTP, FTP       | message  |
| 4. Transport   | host-to-host data transfer                     | TCP, UDP              | segment  |
| 3. Network     | route datagrams from source to destination     | IP, routing protocols | datagram |
| 2. Link        | transfer between neighbouring network elements | Ethernet, PPP         | frame    |
| 1. Physical    | bits "on the wire"                             | —                     | bit      |

vs [[OSI Model]] : the Internet stack has no presentation / session layers → left to the application if needed.

**Links** : [[Protocol Layering]] [[OSI Model]]
