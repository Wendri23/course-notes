---
type: concept
course: Network
status: draft
source: "[[Application Layer]]"
tags: [topic/security]
aliases: [DoH, DoT, DoQ, DNS over HTTPS]
created: 2026-11-11
---
Classic DNS is in **cleartext** over UDP → new transports between host and resolver.

| Variant | Stack | Port | RFC |
|---|---|---|---|
| DNS | DNS / UDP (query), DNS / TCP (update) | 53 | 1035 |
| DoT (over TLS) | DNS / TLS / TCP | 853 | 7858 |
| DoH (over HTTPS) | DNS / HTTP / TLS / TCP | 443 | 8484 |
| DoQ (over QUIC) | DNS / QUIC / UDP | 853 | 9250 |

[[DNSSEC]] protects the data (authenticity) between servers ; DoT/DoH/DoQ protect the transport (confidentiality) between host and resolver.

## DoH goals
- Confidentiality between DNS client and resolver
- Avoid UDP fragmentation for large answers
- Avoid DDoS with spoofed UDP addresses
- Combine web and DNS in a **single HTTP/2 session** on TCP port 443 (JSON format available)

## Trends
| 1980s design | Today |
|---|---|
| infrastructure level | application level (HTTP/2, DoH) |
| for humans | machine-to-machine (M2M), no need for meaningful names |
| UDP | fast, secure, privacy-compliant |

**Links** : [[DNS]] [[DNSSEC]] [[HTTPS and TLS]] [[QUIC]]
