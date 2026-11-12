---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/uml, topic/object-oriented]
aliases: [Public, Private, Protected, Package Visibility]
created: 2026-11-12
---
**Visibility** : the symbol in front of an [[Attribute|attribute]], [[Operation|operation]] or role that says **who can access it** ; relevant mostly for **software modelling** (e.g. Java classes), not for analysis.

| Symbol | Visibility | Visible to |
|---|---|---|
| `+` | **public** | everywhere |
| `-` | **private** | operations of the class only |
| `#` | **protected** | the class and its **descendants** (subclasses, see [[Generalization]]) |
| `~` | **package** | elements of the same package |
| none | unspecified | — |

**Links** : [[Class]] [[Association]]
