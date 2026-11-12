---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/uml]
aliases: [Association Classes]
created: 2026-11-12
---
**Association class** : an [[Association|association]] **reified** as a class so it can carry **attributes** ; drawn as a class box joined to the association line by a dashed line.

```mermaid
classDiagram
direction LR
Student "0..*" -- "0..*" Course : takes
class Grade {
  score : Real
}
note for Grade "association class of takes (dashed link in UML)"
```

- **same name** as the association
- **no multiplicity** : implicitly one association-class instance per association instance (per linked pair)
- use it when an attribute belongs to the **link**, not to either class (a grade belongs to a student *in* a course)
- also works with [[N-ary Association|n-ary associations]]

**Links** : [[Attribute]] [[Class]]
