---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/cryptography, topic/security]
aliases: [KDC]
created: 2026-11-11
---
Trusted third party for [[Symmetric Key Cryptography|symmetric keys]].

- The KDC shares a secret key with **each** registered user
- Each user only knows the key it shares with the KDC
- The KDC helps two users share a one-time **[[Session Key|session key]]** (Needham-Schroeder protocol)

**Links** : [[Person in the middle attack]] [[Certification Authority]]
