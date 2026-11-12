---
type: concept
course: Reseau
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/algorithm, topic/cryptography]
aliases: [Hash, Digest]
created: 2026-11-11
---
**Many-to-1** mapping producing a **fixed-size** output (digest).

- Poor hash : checksum, CRC → easy to find two messages with the same result
- **Strong hash** : computationally infeasible to find x ≠ y with H(x) = H(y) (collision)

## Strategies
- Multiplicative : H(x) = 1 + (x/k)·M, for 0 < x < k
- Modular : H(x) = 1 + x mod M
- Hybrid : H(x) = 1 + a·x mod M
- Rules of thumb : M = prime number, a = 0.618033 (golden ratio)

## Algorithms
- MD2/4/5 (RFC 1321) — `openssl dgst -md5 file`
- SHA-0 †, SHA-1 †, SHA-2, SHA-3 (Keccak) — † = broken
- RIPEMD-128/160/256/320

## Use case : TOR onion services
Onion address derived from the service's public key → self-authenticating + server anonymity.

**Links** : [[Computational Security]] [[Certification Authority]]
