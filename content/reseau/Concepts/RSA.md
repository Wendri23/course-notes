---
type: concept
course: Reseau
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/algorithm, topic/cryptography]
aliases: [Rivest Shamir Adleman]
created: 2026-11-11
---
## Key generation (modulo-n arithmetic)
1. Choose 2 large primes p, q (e.g. 1024 bits each)
2. n = pq, z = (p−1)(q−1)
3. Choose e < n with no common factor with z (relatively prime)
4. Choose d such that **ed mod z = 1**
5. Public key $K^+ = (n, e)$, private key $K^- = (n, d)$

Example : p = 5, q = 7 → n = 35, z = 24, e = 5, d = 29 (5·29 = 145 = 6·24 + 1)

## Encrypt / decrypt
- Encrypt : $c = m^e \bmod n$
- Decrypt : $m = c^d \bmod n$
- Works both ways : $K^-(K^+(m)) = m = K^+(K^-(m))$ (→ also used for signatures)

## Security & limits
- Relies on the lack of fast algorithms to **factor n** into p and q
- Huge numbers, exponentiation is computationally heavy
- Moore's law + better factorisation algorithms (Quadratic Sieve, GNFS) → keys must keep growing (2048 → 3072 bits) → bad for smartphones (CPU, battery)
- Broken by quantum computers (Shor) → [[Post-Quantum Cryptography]]

## OpenSSL
- `openssl genrsa -out my.key -aes128 1024` : generate a key pair
- `openssl rsa -in my.key -noout -text` : show p, q, n, e, d
- `openssl rsa -in my.key -out mypub.key -pubout` : extract public key

**Links** : [[Public Key Cryptography]] [[Elliptic Curve Cryptography]]
