---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/physical]
aliases: [Access network]
created: 2026-11-11
---
Physical link connecting an end system to its **edge router**.

## Three categories
1. Residential : dial-up, [[xDSL]], [[Hybrid Fiber Coax|HFC]] (cable), [[Fiber To The x|FTTx]], PLC
2. Institutional (school, company) : [[Local Area Network|LAN]]
3. Mobile : [[Wireless access networks]]

```mermaid
flowchart TD
NA[Network access] --> R[Residential]
NA --> I[Institutional]
NA --> M[Mobile]
R --> D[Dial-up]
R --> X[xDSL]
R --> H[HFC cable]
R --> F[FTTx / PON]
R --> P[PLC]
I --> L[LAN / Ethernet]
M --> W[WiFi]
M --> C[Cellular 2G→5G]
```

## Dial-up modem (legacy)
- MOdulates digital → analog over the phone line, DEModulates back
- Max 56 kbps (~8 min for a 3-min MP3)
- Can't phone and surf at the same time, "always on" too expensive
- → replaced by **broadband** (xDSL, HFC, FTTx), always on

## Power Line Communications (PLC)
Shared Internet access through existing electrical outlets

**Links** : [[Physical Media]] [[The Network edge]]
