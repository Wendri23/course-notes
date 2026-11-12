---
type: concept
course: AMSI
status: draft
source: "[[Modelling Information Systems]]"
tags: [topic/modelling]
aliases: [Model Quality, Abstract, Understandable, Precise, Predictive, Inexpensive]
created: 2026-11-12
---
**Model qualities** : to be useful a model should be **abstract, understandable, precise, predictive and inexpensive** (Selic, 2003).

> *Essentially, all models are wrong, but some are useful* — George E. P. Box

## Abstract
- focus on the **important aspects**, ignore the others : a model is always a simplification, caricature or viewpoint
- the simplification must be **conservative** with respect to the properties one wants to observe or the analyses one wants to perform
- abstraction is the most effective way to deal with the ever-increasing complexity of IS

## Understandable
- syntax **intuitive for the intended audience** (domain expert, developer…)
- depends on expressiveness and syntax : communicate a complex idea with **few well-chosen symbols** (e.g. a diagram vs SQL code)

## Precise
A model must tell
- **the truth** → correct
- **the whole truth** → complete
- **nothing but the truth** → no noise, no overspecification

Precision is only measurable if the representation is **unambiguous** (well-defined syntax and semantics). Lack of ambiguity is a **prerequisite**, not a guarantee :

$$\forall x,\ bird(x) \Rightarrow fly(x)$$

is formal, hence unambiguous, but **incorrect** (ostriches, penguins).

## Predictive
- the model can be used to **deduce correct and non-trivial properties**
- e.g. from $\forall x,\ Bird(x) \land \lnot Ostrich(x) \Rightarrow Fly(x)$, $Bird(tweety)$ and $\lnot Ostrich(tweety)$ we deduce $Fly(tweety)$
- e.g. in the online shop as specified : *can an order be delivered without payment?*
- depends on abstraction, precision and representation (see [[Learning from Models]])

## Inexpensive
- **drastically cheaper** than the real system, whether or not that system already exists (e.g. a few k€ of model vs 400 M€ of system)

**Links** : [[Model]] [[Modelling Languages]] [[Natural Language Deadly Sins]]
