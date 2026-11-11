---
type: chapter
course: Network
chapter: 2
status: draft
tags: [topic/security, topic/cryptography]
created: 2026-11-11
---
## Outline
1. Introduction
2. Symmetric key encryption : DES, AES
3. Public key encryption : RSA, ECC
4. Hash functions
5. Key distribution and certification

---
## 1. Introduction
- Plaintext → (encryption, key) → ciphertext → (decryption, key) → plaintext
- [[Computational Security]] : breaking costs more than the data is worth, or takes longer than its lifetime
	- brute force = try on average half of the keys
	- no security by obfuscation, never design your own algorithm
- Where is the secret? shared ([[Symmetric Key Cryptography|symmetric]]) vs one side only ([[Public Key Cryptography|public key]])

## 2. Symmetric key encryption
- [[Symmetric Key Cryptography]] : same key on both sides ; Caesar → monoalphabetic → polyalphabetic → Enigma
- [[DES]] : 64-bit blocks, 56-bit key, 16 rounds → broken (22 h in 1999) → 3-DES, CBC
- [[AES]] : 128-bit blocks, 128/192/256-bit keys, 10/12/14 rounds → current standard

## 3. Public key encryption
- [[Public Key Cryptography]] : encrypt with $K^+$, decrypt with $K^-$, $K^-$ not derivable from $K^+$
- [[RSA]] : factorisation of n = pq, $c = m^e \bmod n$, $m = c^d \bmod n$
- [[Elliptic Curve Cryptography|ECC]] : elliptic curve discrete log, same security with shorter keys
- [[Session Key]] : mixed scheme (RSA + AES) or Diffie-Hellman

## 4. Hash functions
- [[Hash Functions]] : many-to-1, fixed size, collision-resistant (MD5, SHA, RIPEMD)

| Symmetric key | Public key | Hash functions |
|---|---|---|
| AES, ChaCha20, 3-DES, RC2/RC4 †/RC5, IDEA, CAST | RSA, ECC | MD2/4/5, SHA-0 †/1 †/2/3, RIPEMD, Poly1305 |

- [[Post-Quantum Cryptography]] : Shor breaks RSA/ECC/DH, Grover barely hurts AES ; post-Snowden : implementations weakened, not the maths

## 5. Key distribution and certification
- [[Person in the middle attack]] : attacker substitutes her own keys → need a Trusted Third Party
- Symmetric → [[Key Distribution Center]] (KDC, Needham-Schroeder)
- Public key → [[Certification Authority]] (X.509 certificates, PKI, CRL/OCSP, Belgian eID)

---
**Links** : [[Computer Networks and the Internet]]
