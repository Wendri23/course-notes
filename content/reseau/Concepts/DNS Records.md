---
type: concept
course: Network
status: draft
source: "[[Application Layer]]"
tags: [topic/addressing, topic/protocol]
aliases: [Resource Record, RR]
created: 2026-11-11
---
The DNS database stores **Resource Records (RR)** = 4-tuple **(Name, Value, Type, TTL)**.

| Type | Name | Value | Example |
|---|---|---|---|
| A / AAAA | hostname | IPv4 / IPv6 address | (relay1.west-coast.foo.com, 145.37.93.126, A) |
| CNAME | alias | canonical (real) name | (www.foo.com, relay1.west-coast.foo.com, CNAME) |
| MX | domain | mail server name | (foo.com, mail.foo.com, MX) |
| NS | domain | authoritative name server | (foo.com, dns.foo.com, NS) |

## DNS message (query and reply share the same format)
| Part | Content |
|---|---|
| Header (12 B) | query ID, flags : query/reply, recursion desired, authoritative answer |
| Question | name + type asked |
| Answer | RRs answering the question |
| Authority / Additional | other useful RRs |

Encapsulation : `IP header (20 B) | UDP header (8 B) | DNS message`

Name encoding : each label prefixed by its length → `7leibniz4info5fundp2ac2be0`

**Links** : [[DNS]] [[DNSSEC]]
