---
type: concept
course: Reseau
status: draft
source: "[[Network Layer]]"
tags: [topic/algorithm, topic/routing]
aliases: [Link state vs distance vector, Routing]
created: 2026-11-11
---
Routing = find a "good" path (sequence of routers) from source to destination.

## Graph model
- Nodes = routers, edges = physical links
- Link cost = delay, money, congestion level...
- "Good" path = usually the **least-cost** path ; if all costs are equal → shortest path

## 2 families
| | Link state (global) | Distance vector (decentralised) |
|---|---|---|
| Knowledge | each router knows the **whole topology** and all link costs | each router knows only its **neighbours** and link costs to them |
| Computation | each router builds its own least-cost tree | iterative, by exchanging with neighbours |
| Algorithm | [[Dijkstra Algorithm\|Dijkstra]] | [[Distance Vector\|Bellman-Ford]] |
| Protocol | [[OSPF]] | [[RIP]] |

## Link state vs distance vector
| Criterion | Link state | Distance vector |
|---|---|---|
| Signalling traffic | n nodes, E links → **O(nE)** messages per update (flooding) | only between neighbours, only when a better path appears |
| Convergence | O(n²) algorithm, possible **oscillations** | may converge slowly, **routing loops**, **count to infinity** |
| Robustness | each node computes **only its own** table → resists another node's error | a wrong value **propagates** through the whole network |

No clear winner : both are used.

## Where the control plane runs
| Per-router control | Logically centralised control (SDN) |
|---|---|
| a routing algorithm in each router, they talk to each other | a remote controller computes routes and pushes tables to local agents |

**Links** : [[Dijkstra Algorithm]] [[Distance Vector]] [[Autonomous Systems]] [[Software Defined Networking]] [[Network Layer Services]]
