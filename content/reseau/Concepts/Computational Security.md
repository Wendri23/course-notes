---
type: concept
course: Reseau
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/cryptography, topic/security]
aliases: [Brute force]
created: 2026-11-11
---
An encryption scheme is **computationally secure** if :
- the cost of breaking the cipher > the value of the encrypted data, **or**
- the time to break it > the useful lifetime of the data

## Brute force (exhaustive search)
- Try every key → on average **half** of all possible keys must be tested
- Defence : a key space too large to explore

## Golden rules
- **No security by obfuscation** : the algorithm is public, only the key is secret
- Use algorithms open to public scrutiny (examen approfondi)
- Don't design your own algorithm

## Where is the secret?
- [[Symmetric Key Cryptography|Symmetric]] : same key on both sides → shared secret
- [[Public Key Cryptography|Public key]] : encryption key public, decryption key private → secret on one side only

**Links** : [[Symmetric Key Cryptography]] [[Public Key Cryptography]]
