---
type: concept
course: Network
status: draft
source: "[[Application Layer]]"
tags: [topic/architecture]
aliases: [Elastic application]
created: 2026-11-11
---
## 3 needs of an application
| Need | Demanding apps | Tolerant apps |
|---|---|---|
| Bandwidth | multimedia (PCM 64 kbps, HDTV 8 Mbps) | **elastic** apps use what is available |
| Latency | VoIP, games (E2E < few 100 ms) | web, mail |
| Reliability | file transfer, e-mail, finance (100 %) | audio, video (loss tolerant) |

## Requirements of common apps
| Application | Data loss | Bandwidth | Time-sensitive |
|---|---|---|---|
| Web, e-mail, file transfer | no loss | elastic | no |
| Live audio/video (IPTV) | tolerant | audio ≤ 1 Mbps, video ≤ 8 Mbps | yes (≤ 400 ms mouth-to-ear) |
| Stored audio/video (VoD) | tolerant | same | yes (≤ 10 s buffering) |
| Interactive games | tolerant | ≤ 10 kbps | yes |
| Instant messaging | no loss | elastic | variable |

## What transport offers
| TCP | UDP |
|---|---|
| connection setup | none |
| reliable | unreliable |
| flow + congestion control | none |
| no timing / bandwidth guarantee | no timing / bandwidth guarantee |

## Which app uses what
| Application | App protocol | Transport |
|---|---|---|
| Web | HTTP(S) | TCP (QUIC/UDP for HTTP/3) |
| E-mail | SMTP | TCP |
| Remote login | Telnet, SSH | TCP |
| File transfer | FTP, SFTP | TCP |
| Streaming | RTP/RTSP · DASH | UDP · TCP |
| VoIP | proprietary | typically UDP |
| DNS | DNS | UDP (queries), TCP (DB updates) |

**Links** : [[The Network edge]] [[Socket]] [[HTTP]]
