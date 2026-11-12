---
type: concept
course: Reseau
status: draft
source: "[[Application Layer]]"
tags: [topic/protocol]
aliases: [Base64, Quoted-printable, Multipurpose Internet Mail Extensions]
created: 2026-11-11
---
SMTP only carries **7-bit ASCII** → problem for accents, Unicode, images, attachments → encode them.

## Encoding schemes
| Scheme | How | Best for |
|---|---|---|
| Quoted-printable | non-ASCII byte → `=` + 2 hex chars (`é` → `=E9`, space → `=20`) | mostly-ASCII text |
| Base64 | 3 bytes (24 bits) → 4 × 6-bit values → 4 characters | binary (images, files) |

Base64 example : `NAM` = 01001110 01000001 01001101 → 010011 100100 000101 001101 = 19, 36, 5, 13 → `TkFN`

## MIME headers (RFC 2045)
```
From: alice@crepes.fr
To: bob@hamburger.edu
Subject: Picture of yummy crepe.
MIME-Version: 1.0                    <- MIME version
Content-Transfer-Encoding: base64    <- encoding method
Content-Type: image/jpeg             <- type/subtype
base64 encoded data ...
```

## Multipart message
```
Content-Type: multipart/mixed; boundary=StartOfNextPart
--StartOfNextPart
Dear Bob, Please find a picture of a crepe.
--StartOfNextPart
Content-Transfer-Encoding: base64
Content-Type: image/jpeg
base64 encoded data ...
--StartOfNextPart
Do you want the recipe?
```
Review question (Excel attachment) : same structure with `Content-Type: application/vnd.ms-excel` (or `.openxmlformats...` for xlsx) + base64.

> The Excel MIME type is completed from general knowledge.

**Links** : [[Electronic Mail]]
