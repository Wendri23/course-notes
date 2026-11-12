---
type: concept
course: AMSI
status: draft
source: "[[UML Overview]]"
tags: [topic/uml]
aliases: [UML Diagram Types, Structure Diagram, Behaviour Diagram, Behavior Diagram]
created: 2026-11-12
---
**UML diagrams** : the 14 diagram types of UML 2.5, split into **structure diagrams** (what the system is made of) and **behaviour diagrams** (what it does).

```mermaid
flowchart TD
D[UML diagram] --> S[Structure]
D --> B[Behaviour]
S --> CD[Class]
S --> OD[Object]
S --> PK[Package]
S --> CO[Component]
S --> CS[Composite structure]
S --> DE[Deployment]
S --> PR[Profile]
B --> UC[Use case]
B --> AC[Activity]
B --> SM[State machine]
B --> IN[Interaction]
IN --> SQ[Sequence]
IN --> CM[Communication]
IN --> TI[Timing]
IN --> IO[Interaction overview]
```

- the course focuses on **class**, **state machine**, **activity** and **use case** diagrams, plus OCL constraints
- [[Class Diagram]] : static structure ; object diagrams show concrete instances of it (see [[Object]])
- UML covers both **structural and behavioural** modelling, which is one of its strengths ; keeping all these views **consistent** is one of its costs

**Links** : [[UML]] [[UML Usage Styles]]
