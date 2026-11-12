---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/object-oriented]
aliases: [Objects, Instance, Class Instance, Object Diagram, Object-Oriented Modelling]
created: 2026-11-12
---
**Object** : an element of the modelled world that has an **identity**, a **lifespan**, a **state** and a **relevance / meaning** in the domain.

| Property | Meaning |
|---|---|
| **Identity** | it exists, or is considered to exist ; a *thing* rather than a *property* |
| **Lifespan** | it exists for a period of time ; usually not an action or event |
| **State** | its characteristics (attribute values) at a given time |
| **Relevance** | established in the domain, described in the **glossary** |

## Example
`Sport-IT : Catalogue` with `Season = Summer`, `Year = 2026`
- identity : Sport-IT, summer 2026
- lifespan : from the catalogue's creation, open-ended
- state : the values of its attributes
- meaning : a structured collection of items offered to customers with their prices ; a summer catalogue is used from January to October, then kept

## Object-oriented modelling
Describe and decompose the IS by the **objects of the application domain**, then progressively add how they are **connected**, and later how they **behave and interact**.

Why objects : decomposition of complexity, few fundamental concepts, several abstraction levels, close to how we perceive the world, iterative modelling, reuse across projects.

A domain may hold millions of objects, so we abstract them :

| Abstraction | Captured by |
|---|---|
| object properties | [[Classification]] → class diagram |
| static relations | [[Association|associations]] → class diagram |
| intra-object behaviour and state | [[Operation|operations]] + state machine diagram |
| inter-object interactions | use cases, scenarios, activity and sequence diagrams |

## Object diagram
Shows concrete objects (`name : Class`, underlined) and their links at one moment. Used to test a class diagram : a given object diagram is either **accepted** or **forbidden** by the model.

**Links** : [[Class]] [[Class Diagram]] [[UML Constraint]]
