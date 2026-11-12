---
type: concept
course: Reseau
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/algorithm, topic/cryptography]
aliases: [ECC]
created: 2026-11-11
---
## Principle
- Curve $y^2 = x^3 + ax + b$ : symmetric w.r.t. the x-axis, a line crosses it in 3 points
- "Snooker game" : start at point A, bounce n times along the curve → final point
- Knowing the curve, A and the final point, finding n is hard
- In practice : integers only, modulo a prime (e.g. $y^2 = x^3 - x + 1$ mod 97)

## Keys
Given a prime modulo, a curve and a starting point A :
- $K^-$ = the number n
- $K^+$ = the point reached after n bounces

## vs RSA
- Based on the **elliptic curve discrete logarithm** : only brute force so far
- **Same protection as [[RSA]] with much shorter keys** (256 bits vs 3072) → good for mobile devices
- Still vulnerable to quantum computers (Shor) → [[Post-Quantum Cryptography]]

**Links** : [[Public Key Cryptography]] [[RSA]]
