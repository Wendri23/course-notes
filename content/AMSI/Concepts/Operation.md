---
type: concept
course: AMSI
status: draft
source: "[[Class Diagrams]]"
tags: [topic/uml, topic/object-oriented]
aliases: [Operations, Method, Static Operation, Class Operation, Instance Operation]
created: 2026-11-12
---
**Operation** : a **service / function** offered by the instances of a [[Class|class]] (or by the class itself), written `[vis] opName([par :] type, …) [: type]`.

- [[Visibility|visibility]] : same symbols as for attributes
- parameter and result types : basic types or user-defined types (including classes)
- in **analysis**, operations are optional and must have a clear domain meaning ; in **design** they represent the software's services

## Operation vs method
- **operation** = the declared service (signature)
- **method** = the implementation that realises it ; **class diagrams do not describe methods**
- describe a method with an activity or state machine diagram, a programming language or pseudo-code, or executable UML (ALF / fUML, SysML, KerML)
- **pre / post conditions** go in notes, in OCL or natural language

Example : `computeAge() := currentDate - this.birthDate`.

## Instance vs static operation
- **instance operation** (default) : invoked **on an object** ; the result may depend on its state
- **static operation** (name **underlined**) : belongs to the **class itself**, not to its instances

**Links** : [[Abstract Class]] [[Attribute]] [[UML Constraint]]
