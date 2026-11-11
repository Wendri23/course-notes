---
type: concept
course: Network
status: draft
source: "[[Application Layer]]"
tags: [topic/architecture, topic/performance]
aliases: [CDN]
created: 2026-11-11
---
- The **content providers** are the CDN's customers
- The CDN installs hundreds of servers in **lower-tier ISPs**, close to users
- It replicates the customers' content and updates it when the provider changes it

## How a request is redirected (via DNS)
```mermaid
sequenceDiagram
participant U as User
participant O as Origin www.foo.com
participant D as CDN authoritative DNS
participant C as Closest CDN server
U->>O: GET page
O->>U: HTML with links rewritten to www.cdn.com/www.foo.com/ruth.gif
U->>D: DNS query www.cdn.com
D->>D: find user's ISP, use "map" of distances
D->>U: IP of best CDN server
U->>C: GET ruth.gif
C->>U: object
```
- Origin server distributes the HTML, CDN distributes the files
- Not only web pages : live and stored audio/video, software updates

## Operators (2025)
| CDN | Size |
|---|---|
| Akamai | leader, 365 000+ servers in 130+ countries |
| Cloudflare | 10 %+ of websites |
| Meta (in-house) | CDN sites inside ISPs, split TCP |

**Links** : [[Web Caching]] [[DNS]] [[ISP Hierarchy]]
