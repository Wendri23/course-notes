---
type: concept
course: Network
status: draft
source: "[[Cryptography Basics]]"
tags: [topic/security]
aliases: [CA, X.509, PKI, Certificate]
created: 2026-11-11
---
Trusted third party binding a **public key to an identity**.

## Certificate (X.509, ITU-T)
1. Bob gives a proof of identity to the CA
2. The CA creates a certificate binding Bob to $K_B^+$, **digitally signed** with the CA's private key
3. Alice gets Bob's certificate (from Bob or elsewhere) and checks it with the **CA's public key** → Bob's valid public key

```mermaid
flowchart LR
B[Bob] -- "1. proof of identity + K_B+" --> CA[CA]
CA -- "2. certificate signed with K_CA-" --> B
B -- "3. certificate" --> A[Alice]
A -- "4. verify with K_CA+" --> K["✔ Bob's public key K_B+"]
```

## Public Key Infrastructure (PKI)
PKI = authorities (Registration Authority RA + CA) + directory + procedures (creation, update, **revocation**)
- Revocation check : Certificate Revocation Lists (**CRL**) or Online Certificate Status Protocol (**OCSP**)

```mermaid
flowchart LR
U[User] -- request --> RA[Registration Authority]
RA -- request --> CA[Certification Authority]
CA -- "certificates + CRL" --> D[(Directory)]
U -- "LDAP / HTTP / OCSP" --> D
```

## Example : Belgian eID
- X.509 certificates stored on the chip
- Only for **authentication and signature**, not encryption

**Links** : [[Person in the middle attack]] [[Public Key Cryptography]] [[Key Distribution Center]]
