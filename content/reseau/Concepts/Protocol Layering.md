---
type: concept
course: Network
status: draft
source: "[[Computer Networks and the Internet]]"
tags: [topic/architecture]
aliases: [Layers, Encapsulation]
created: 2026-11-11
---
Networks are complex (hosts, routers, links, apps, protocols, HW, SW) → organise them in **layers**.

## Principle (air travel analogy : ticket → baggage → gate → runway → routing)
- Each layer implements a service
- via its own internal actions
- relying on the services of the layer below

## Why layering?
- Abstraction : explicit structure to identify and relate the pieces (reference model)
- Modularity : changing one layer's implementation is transparent to the rest
- But "layering considered harmful?" (overhead, duplicated functions)

## Encapsulation
Each layer takes data from above, **adds a header**, and passes the new unit (PDU) to the layer below.

| Layer | Unit | Content |
|---|---|---|
| Application | message | `M` |
| Transport | segment | `Ht │ M` |
| Network | datagram | `Hn │ Ht │ M` |
| Link | frame | `Hl │ Hn │ Ht │ M` |
| Physical | bits | 0101... |

Receiver side = reverse (decapsulation) : each layer removes its own header.

## Logical communication
Each layer is distributed : entities in each node exchange messages with their **peers** of the same layer (e.g. transport Data / ACK).

```mermaid
flowchart LR
subgraph Host A
A5[Application] --> A4[Transport] --> A3[Network] --> A2[Link] --> A1[Physical]
end
subgraph Host B
B1[Physical] --> B2[Link] --> B3[Network] --> B4[Transport] --> B5[Application]
end
A1 == real transmission ==> B1
A4 -. "logical: Data / ACK" .- B4
```

**Links** : [[Internet Protocol Stack]] [[OSI Model]] [[What is a Protocol]]
