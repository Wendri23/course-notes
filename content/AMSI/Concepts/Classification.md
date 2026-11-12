---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/object-oriented, topic/modelling]
aliases: [Granularity]
created: 2026-11-12
---
**Classification** : decomposing the modelled world into **sets of objects sharing characteristics that are relevant for the modelling purpose** ; each set becomes a [[Class]].

- example : the Brussels and Namur warehouses → class `Warehouse` = the set of warehouses, because the business needs to know where items are stored
- the class must be described in the **glossary**

## Depends on the purpose
The same object can be classified differently. For a **real-estate company**, the fact that a building is used as a warehouse may be irrelevant : the Brussels warehouse is then just a `Property`.

## Granularity
Objects of a class share characteristics but **differences remain**. Classes let us choose the right granularity :
- the category of item (shoe, ball) is **not relevant** → one class `Item` is enough
- it **is relevant** → one class per category, usually under a common superclass (see [[Generalization]])

## Several valid models
There may be **more than one valid model** of the same domain. Example : `Order mentions Item` directly, or `Order contains OrderLine`, `OrderLine mentions Item` (which can carry a quantity).

**Links** : [[Object]] [[Class Diagram]] [[Model Qualities]]
