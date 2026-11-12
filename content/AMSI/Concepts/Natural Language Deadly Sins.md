---
type: concept
course: AMSI
status: draft
source: "[[Modelling Information Systems]]"
tags: [topic/requirements]
aliases: [7 Deadly Sins, Seven Deadly Sins, Ambiguity, Noise, Silence, Overspecification, Contradiction, Forward Reference, Remorse]
created: 2026-11-12
---
**The 7 "deadly sins" of natural language** : the seven defects that make a specification written in plain language unreliable : **ambiguity, noise, silence, overspecification, contradiction, forward reference, remorse**.

| Sin | Meaning |
|---|---|
| **Ambiguity** | several interpretations for the same text |
| **Noise** | useless elements (e.g. redundancies) |
| **Silence** | underspecification : part of the problem is not specified |
| **Overspecification** | describing the solution, not the problem ; or describing irrelevant parts |
| **Contradiction** | incompatible statements |
| **Forward reference** | mentioning something before it is defined |
| **Remorse** | defining something late or superficially |

## Ambiguity example
*"Customers can order the **same** books on the different Amazon websites (.com, .co.uk, .fr…)."* What does *same* mean ?
- books are stored by different regional sites, each website can offer books stored on another site → same = **identity**
- each regional site owns a copy of each book → same = **similarity**

Silence and noise map onto the precision quality : a model must tell the whole truth and nothing but the truth (see [[Model Qualities]]).

**Links** : [[Modelling Languages]] [[IS Analysis]]
