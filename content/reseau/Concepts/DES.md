---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/algorithm, topic/cryptography]
aliases: [Data Encryption Standard, 3-DES, CBC]
created: 2026-11-11
---
**Data Encryption Standard** : 64-bit plaintext blocks, **56-bit** symmetric key.

## Encryption
1. Initial permutation
2. **16 identical rounds** : swap left/right halves + function using a different **48-bit subkey** (derived from the 56-bit key) → expansion (E-box), substitution, XOR, permutation (P-box)
3. Final permutation
- Decryption = reverse operations

Goal : no correlation between ciphertext and plaintext or key → only exhaustive search works.

## How secure? → broken
| Challenge | Date | Time to crack |
|---|---|---|
| I | Jan 1997 | 96 days |
| II-1 | Feb 1998 | 41 days |
| II-2 | Jul 1998 | 56 h |
| III | Jan 1999 | **22.25 h** |

→ 56-bit key too short.

## 3-DES
Three successive DES encodings → longer effective key.

## Cipher-Block Chaining (CBC)
- Each plaintext block is XORed with the **previous ciphertext block** before encryption : $c_j = K(m_j \oplus c_{j-1})$
- First block uses an **Initialisation Vector (IV)**
- → identical plaintext blocks give different ciphertexts (used in IEEE 802.11i)

```mermaid
flowchart LR
IV[IV] --> X1((⊕))
M1[m1] --> X1 --> E1[K] --> C1[c1]
C1 --> X2((⊕))
M2[m2] --> X2 --> E2[K] --> C2[c2]
C2 --> X3((⊕))
M3[m3] --> X3 --> E3[K] --> C3[c3]
```

**Links** : [[Symmetric Key Cryptography]] [[AES]]
