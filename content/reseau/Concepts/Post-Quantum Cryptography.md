---
type: concept
course: Reseau
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/cryptography]
aliases: [PQC, Shor, Grover]
created: 2026-11-11
---
## Public key → broken
- **Shor's algorithm** efficiently solves integer factorisation and discrete logarithm
- → [[RSA]], Diffie-Hellman and [[Elliptic Curve Cryptography|ECC]] all vulnerable on a cryptographically relevant quantum computer (CRQC)
- New threat : **Harvest Now, Decrypt Later** (HNDL) → record today, decrypt once quantum is available

## Symmetric → still fine
- **Grover's algorithm** : quadratic speedup on brute force
- Misconception : "key lengths must be doubled"
- But Grover is hardly parallelisable : 256 quantum computers only divide runtime by 16
- Consensus : **AES-128 remains secure in practice**

## Post-Snowden era
No sign that the maths (one-way functions) were broken, but signs that **implementations** were deliberately weakened.

## Recommended sizes (ANSSI)
| | until 2020 | 2021–2030 | > 2030 |
|---|---|---|---|
| Symmetric key (AES) | 100 | 128 | 128 |
| RSA modulo | 2048 | 2048 | 3072 |
| ECC | 200 | 256 | 256 |
| Hash digest | 200 | 256 | 256 |

**Links** : [[AES]] [[RSA]] [[Elliptic Curve Cryptography]]
