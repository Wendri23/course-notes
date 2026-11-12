---
type: concept
course: Reseau
status: draft
source: "[[Link Layer]]"
tags: [topic/physical, topic/wireless]
aliases: [Code Division Multiple Access, Chipping sequence]
created: 2026-11-11
---
Channel partitioning **by code** : all users share the **same frequency** and transmit **at the same time**, each with its own **chipping sequence** (code). Used mostly in wireless.

| Step | Operation |
|---|---|
| Encoding | data bit × chipping sequence (each bit → M "chips") |
| Decoding | inner product of the received signal with the sender's code, divided by M |

Users coexist with minimal interference if the codes are **orthogonal** : the other users' signals cancel out when decoding.

## Example (general knowledge, slides are figures)
Codes of length 4 : user 1 = (1, 1, −1, −1), user 2 = (1, −1, 1, −1) → orthogonal (inner product = 0).

| | Chips |
|---|---|
| User 1 sends bit 1 | (1, 1, −1, −1) |
| User 2 sends bit −1 | (−1, 1, −1, 1) |
| Channel = sum | (0, 2, −2, 0) |
| Decode user 1 : (0·1 + 2·1 + (−2)(−1) + 0·(−1)) / 4 | **1** |
| Decode user 2 : (0·1 + 2(−1) + (−2)·1 + 0·(−1)) / 4 | **−1** |

**Links** : [[Multiple Access Protocols]] [[Time Division Multiplexing]] [[Frequency Division Multiplexing]] [[Wireless access networks]]
