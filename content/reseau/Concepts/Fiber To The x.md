---
type: concept
course: Reseau
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/hardware, topic/physical]
aliases: [FTTx, FTTH, PON]
created: 2026-11-11
---
Fiber runs from the provider down to a point "x", copper (e.g. VDSL2) covers the rest.

| Variant | Fiber goes up to |
|---|---|
| FTTN / FTTCab | Node / street cabinet (e.g. Proximus VDSL2) |
| FTTC | Curb |
| FTTB | Building |
| FTTH (FTTP) | Home (premises) |

## Passive Optical Network (PON)
- The fiber towards the subscribers is **shared** via passive optical splitters (e.g. 1:8, 1:16)
- Downstream/upstream separated by Wavelength Division Multiplexing (WDM)
- **OLT** (Optical Line Terminal) at the central office ↔ **ONU/ONT** (Optical Network Unit/Terminal) at the user, through the ODN (Optical Distribution Network)
- EPON (IEEE 802.3ah) = Ethernet over PON, GEPON = Gigabit EPON

**Links** : [[Network Access]] [[xDSL]] [[Physical Media]]
