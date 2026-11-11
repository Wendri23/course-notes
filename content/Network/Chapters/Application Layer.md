---
type: chapter
course: Network
chapter: 3
status: draft
tags: [topic/protocol, topic/architecture]
created: 2026-11-11
---
## Outline
1. Principles of application layer protocols
2. Web browsing and HTTP
3. Domain name resolution (DNS)
4. File transfer (FTP)
5. Electronic mail : SMTP, POP3, IMAP
6. Content distribution : Web caching, CDN, P2P

---
## 1. Principles of application layer protocols
- [[Application Layer Protocol]] : process, user agent, what a protocol defines, client-server
- [[Socket]] : door between app and transport ; process = IP + port
- [[App Transport Requirements]] : bandwidth / latency / reliability → TCP or UDP

## 2. Web browsing and HTTP
- [[HTTP]] : stateless, request/response, methods, status codes, conditional GET
- [[HTTP Connections]] : non-persistent (2 RTT/object) → persistent → pipelining
- [[QUIC]] : HTTP/3 over UDP, no head-of-line blocking
- [[Cookies]] : state on top of stateless HTTP, fingerprinting
- [[HTTPS and TLS]] : certificate + pre-master secret, TLS 1.3

## 3. Domain name resolution (DNS)
- [[DNS]] : hierarchy root → TLD → authoritative, iterative vs recursive, caching
- [[DNS Records]] : A, AAAA, CNAME, MX, NS
- [[DNSSEC]] : signed records, ZSK / KSK chain of trust
- [[DNS Privacy]] : DoT, DoH, DoQ

## 4. File transfer (FTP)
- [[FTP]] : control (21) and data (20) connections, active vs passive, FTPS / SFTP

## 5. Electronic mail
- [[Electronic Mail]] : user agent, mail server, SMTP (push)
- [[MIME]] : 7-bit ASCII limit → base64, multipart
- [[Mail Access Protocols]] : POP3 (stateless) vs IMAP (stateful)
- [[Email Security]] : CIA, PGP, DKIM

## 6. Content distribution
- [[Web Caching]] : proxy close to the client, cheaper than a faster link
- [[Content Distribution Network]] : servers in ISPs, redirection via DNS
- [[Peer-to-Peer]] : centralised, query flooding, decentralised ; BitTorrent swarming

## Protocol overview
| Protocol | Transport | Port | Pull / push | State |
|---|---|---|---|---|
| HTTP | TCP (QUIC for HTTP/3) | 80 / 443 | pull | stateless (+ cookies) |
| DNS | UDP (TCP for updates) | 53 | query / reply | — (caching) |
| FTP | TCP | 21 control, 20 data | both | stateful |
| SMTP | TCP | 587 (25) | push | — |
| POP3 | TCP | 110 | pull | stateless |
| IMAP | TCP | — | pull | stateful |

## Key ideas about protocols
| Concept | Example |
|---|---|
| Control vs data messages | FTP control / data connections |
| In-band vs out-of-band | HTTP (in-band) vs FTP (out-of-band) |
| Stateless vs stateful | HTTP, POP3 vs FTP, IMAP |
| Reliable vs unreliable | TCP vs UDP |
| Centralised vs decentralised | DNS hierarchy, P2P architectures |
| Complexity at the edge | DNS is a core function but runs at the application layer |

---
## Review questions
- An app with no data loss **and** highly time-sensitive? → [[App Transport Requirements]] (e.g. remote surgery, online trading)
- Header lines of an e-mail with an Excel attachment? → [[MIME]]
- Roles of local vs authoritative name server? → [[DNS]]
- What is an overlay network in P2P? → [[Peer-to-Peer]]
- Why does a TCP server need more sockets than a UDP server? → [[Socket]]

---
**Links** : [[Computer Networks and the Internet]] [[Cryptography Basics]]
