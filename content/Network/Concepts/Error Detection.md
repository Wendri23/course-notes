---
type: concept
course: Network
status: draft
source: "[[Link Layer]]"
tags: [topic/algorithm, topic/reliability]
aliases: [CRC, Parity check, Checksum, FEC, Error correction]
created: 2026-11-11
---
Sender adds **EDC** bits (Error Detection and Correction, redundancy) to the data **D**. Receiver checks D' against EDC'.
Goal : minimise **undetected** errors. More EDC bits → lower risk.

## 3 techniques
| Technique | How | Detects | Where |
|---|---|---|---|
| Single-bit parity | 1 bit so that the number of 1s is even | any **odd** number of bit errors ; only 50 % with error bursts | |
| 2D parity (LRC / VRC) | parity per row **and** per column | detects **and corrects** a single bit error (= **FEC**, Forward Error Correction) | |
| Checksum | 1's complement sum of 16-bit words | weak protection | transport (UDP, TCP), software |
| **CRC** | polynomial division modulo 2 | all bursts **< r+1 bits** | link layer, hardware |

## Checksum : pros and cons
| Pros | Cons |
|---|---|
| little overhead (16 bits) | **weak** protection |
| simple, fast, easy in software | |

## Cyclic Redundancy Check
- Data D = d bits, generator G = r+1 bits (known by both sides)
- Sender picks R (r bits) so that `<D, R>` is **exactly divisible by G** (modulo 2, i.e. XOR, no carries)
- Receiver divides `<D, R>` by G : **non-zero remainder → error**

Sender's computation :
$$D \cdot 2^r \oplus R = nG \;\Rightarrow\; R = \text{remainder}\left(\frac{D \cdot 2^r}{G}\right)$$

Worked example (d = 6, r = 3) : D = 101110, G = 1001
```
101110 000   ÷ 1001
1001
--- 0010 1
       101 0
      1001
      ---- 0011 0
             110 0
            1001
            ---- 0101 0
                  1001
                  ---- 011   → R = 011
```
Frame sent : `101110 011`.

> D and G are the classic Kurose & Ross values (the slide is a figure) ; division redone here.

**Links** : [[Link Layer Services]] [[UDP]] [[Ethernet]]
