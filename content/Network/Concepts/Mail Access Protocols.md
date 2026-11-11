---
type: concept
course: Network
status: draft
source: "[[Application Layer]]"
tags: [topic/protocol]
aliases: [POP3, IMAP]
created: 2026-11-11
---
SMTP only delivers **to** the receiver's server. Retrieval **from** the server needs an access protocol.

| | POP3 (RFC 1939) | IMAP (RFC 1730) | Web mail (Gmail) |
|---|---|---|---|
| Messages live | on the client (downloaded) | on the **server** | on the server |
| Folders | no | yes, on the server | yes |
| State across sessions | **stateless** | **stateful** (folder names, message ↔ folder) | — |
| Several devices | bad | good (nomadic users) | good |
| Protocol | POP3 (port 110) | IMAP | HTTP |

## POP3 modes
- **Download and delete** : Bob can't re-read mails if he changes client
- **Download and keep** : copies on each client

**Links** : [[Electronic Mail]]
