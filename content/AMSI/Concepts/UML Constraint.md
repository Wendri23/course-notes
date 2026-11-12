---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/uml]
aliases: [Constraint, Constraints, Additional Constraints, Identifier, Role Exclusion, xor]
created: 2026-11-12
---
**UML constraint** : an extra rule attached to a UML element, written between braces `{…}` or in a note, and expressed in **natural language**, **OCL** or another constraint language.

- UML has **dedicated notation** for common constraints ; anything else is a **generic constraint**
- a class diagram alone cannot express every rule : constraints add **precision** (see [[Model Qualities]])

## Common examples
| Constraint | Meaning |
|---|---|
| **Identifier** | one or more attributes whose values identify an object (e.g. `{id}` on `isbn`) |
| **Role exclusion** `{xor}` | an object takes part in **only one** of several associations |
| `{readOnly}` | the [[Attribute|attribute]] cannot be modified |
| `{complete, disjoint}` | see [[Generalization Set Constraints]] |
| pre / post conditions | on an [[Operation|operation]], in a note, OCL or natural language |

The exact notation of the identifier and exclusion examples is in the slides as images ; check them against the course.

## Testing a constraint
Draw small **object diagrams** (see [[Object]]) and decide whether each one is **accepted** or **forbidden** by the model : an unwanted accepted case means a missing constraint.

**Links** : [[Multiplicity]] [[Class Diagram]]
