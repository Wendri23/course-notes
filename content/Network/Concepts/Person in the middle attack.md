---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/security]
aliases: [Man in the middle, MITM]
created: 2026-11-11
---
Trudy sits between Alice and Bob and impersonates each of them with **her own key pair** : she decrypts, reads and re-encrypts everything (Alice and Bob may only find out later).

```mermaid
sequenceDiagram
participant A as Alice
participant T as Trudy
participant B as Bob
A->>T: "send me your public key" (meant for Bob)
T->>A: K_T+ (pretends to be Bob)
A->>T: K_T+(m)
T->>T: decrypt with K_T-, read m
T->>B: K_B+(m)
```

- Root cause : nothing proves that a public key really belongs to its claimed owner
- Solution : a **Trusted Third Party (TTP)**

| | Symmetric key | Public key |
|---|---|---|
| Issue | how to share a secret key? | how to securely get a public key? |
| TTP | [[Key Distribution Center]] (KDC) | [[Certification Authority]] (CA) |

**Links** : [[Session Key]] [[Public Key Cryptography]]
