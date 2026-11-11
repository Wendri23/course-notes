---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/cryptography, topic/security]
aliases: [Diffie-Hellman, Mixed scheme]
created: 2026-11-11
---
Best of both worlds : public key to agree on a key, then fast symmetric encryption ([[AES]]) with this **session key** $K_S$.

## Mixed scheme
1. Alice generates an AES key $K_S$
2. She encrypts it with Bob's public key $K_B^+$ ([[RSA]])
3. Bob decrypts it with $K_B^-$ → both share $K_S$

```mermaid
sequenceDiagram
participant A as Alice
participant B as Bob
A->>A: generate AES key K_S
A->>B: K_B+(K_S)  [RSA]
B->>B: K_B-(...) = K_S
A-->>B: data encrypted with K_S [AES]
```

## Diffie-Hellman
1. Alice and Bob agree (publicly) on g and p
2. Alice picks random A, sends $g^A \bmod p$ ; Bob picks random B, sends $g^B \bmod p$
3. Each computes $(g^B)^A = (g^A)^B = g^{AB} \bmod p$ → shared key
```mermaid
sequenceDiagram
participant A as Alice
participant B as Bob
A->>B: agree on g, p (public)
A->>A: pick secret A
B->>B: pick secret B
A->>B: g^A mod p
B->>A: g^B mod p
A->>A: (g^B)^A = g^AB mod p
B->>B: (g^A)^B = g^AB mod p
```
- Security : given g, p and $g^X \bmod p$, guessing X is hard (discrete logarithm)
- ⚠️ No authentication → vulnerable to [[Person in the middle attack]]

**Links** : [[Symmetric Key Cryptography]] [[Public Key Cryptography]]
