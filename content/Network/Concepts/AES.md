---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/algorithm, topic/cryptography]
aliases: [Advanced Encryption Standard, Rijndael]
created: 2026-11-11
---
**Advanced Encryption Standard** : Rijndael (Rijmen – KU Leuven & Daemen, 2000), adopted by NIST to replace [[DES]].

- 128-bit blocks, keys of **128, 192 or 256 bits**
- **10 / 12 / 14 rounds** of : byte substitution → row shifting → column mixing → addition with round key

## Security
- A machine cracking DES in 1 s would need ~149·10¹² years for AES
- Best cryptanalysis (2011) : equivalent to a 2-bit key reduction (gain ×4) → still ~8·10³⁷ steps, i.e. ~2·10⁹ years with 10¹² devices testing 10⁹ keys/s
- Remains secure against quantum computers → [[Post-Quantum Cryptography]]

**Links** : [[Symmetric Key Cryptography]] [[DES]]
