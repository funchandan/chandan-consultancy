# Systems Design Reference

## What interviewers are actually testing at PM/Director level

Technical systems design questions at UX Director / Senior PM interviews test different things than they do for engineers:

- **Product judgment inside a system** — can you define requirements that actually reflect user needs?
- **Technical fluency** — can you have a real conversation with engineers without hand-waving?
- **Tradeoff reasoning** — do you understand what you're giving up and why it's acceptable?
- **Scale intuition** — do your architecture choices make sense for the actual load?

You are NOT expected to produce a production-ready architecture. You ARE expected to demonstrate that you understand why the key decisions matter.

---

## Architecture

### Step 1: Functional requirements (what it does)
List the core capabilities the system must have. Be specific. "Users can send messages" is weak. "Users can send text and media messages to individuals and groups of up to 1000 members, with delivery confirmation" is strong.

Keep to 5-7 requirements. More than that and you're listing features, not framing a system.

### Step 2: Non-functional requirements (how it behaves)
These are the constraints that drive architecture decisions:
- **Latency** — what's the acceptable p99? (e.g., "search results in <200ms for 99% of queries")
- **Availability** — what's the SLA? (e.g., "99.9% uptime = 8.7 hours downtime/year")
- **Consistency** — strong (everyone sees the same state) vs. eventual (reads may lag writes)
- **Durability** — what happens if a node fails? Can we lose data?
- **Scale** — DAU, read:write ratio, storage growth

### Step 3: High-level components
Draw (or describe) the boxes and arrows:
- **Client** — web, mobile, API consumer
- **API gateway / load balancer** — entry point, auth, rate limiting
- **Services** — break along domain boundaries (users, content, notifications, etc.)
- **Storage** — databases (SQL vs NoSQL and why), caches, object storage, queues
- **Async processing** — background jobs, event streams, workers

One key rule: name each component and state its single responsibility. If you can't state the responsibility in one sentence, split it.

### Step 4: Data model
For the 2-3 most important entities:
- What are the key fields?
- What's the primary key and why?
- What relationships exist?
- Why this storage type? (e.g., "I'd use PostgreSQL for user data because writes are low-volume and we need ACID guarantees, and Redis for the session cache because we need sub-millisecond reads at high throughput")

Don't model every table. Model the ones where the storage choice or schema drives architecture decisions.

### Step 5: API contract (key endpoints only)
State 3-5 critical API endpoints:
```
POST /api/v1/messages
  Body: { recipient_id, content, media_url? }
  Returns: { message_id, status: "queued" }
  Notes: async — delivery status via webhook or polling

GET /api/v1/messages/{conversation_id}
  Query: after_id? (cursor-based pagination)
  Returns: { messages: [...], next_cursor }
```

For PM/Director level, the goal is to show you understand the contract matters — not to write production API docs.

---

## Scale estimation (back-of-envelope)

Always do a quick estimate. It takes 60 seconds and shows you think in orders of magnitude.

Template:
```
Users: 100M DAU
Writes: 100M × 10 messages/day = ~12k writes/sec
Reads: 100M × 50 reads/day = ~58k reads/sec (read-heavy)
Storage: 1KB/message × 1B messages/day = ~1TB/day → object storage for media, compressed text in DB
```

These numbers inform every architecture decision. A write-heavy system with 100k writes/sec needs very different choices than a read-heavy system at 1k writes/sec.

---

## Key architecture decisions and tradeoffs

### SQL vs NoSQL
- **SQL (PostgreSQL, MySQL)**: ACID, relational queries, schema enforcement. Use for: user accounts, transactions, anything where consistency matters.
- **NoSQL (DynamoDB, Cassandra, MongoDB)**: flexible schema, horizontal scale, eventual consistency. Use for: high-write feeds, time-series data, document storage.

**The trap**: saying "I'd use NoSQL for scale" without justifying it. Always say *why* the tradeoff is acceptable for this use case.

### Cache strategy
- **Read-through**: cache sits in front of DB; on miss, fetches from DB and populates cache
- **Write-through**: writes go to cache and DB simultaneously
- **Cache-aside**: application manages cache explicitly

Use Redis or Memcached for: session data, hot read paths, rate limiting counters.

### Async vs sync
- **Sync**: caller waits for result. Use when: the user needs the result immediately, failure is unacceptable.
- **Async (queue)**: work is queued and processed separately. Use when: work can be deferred, failure is retriable, load needs to be buffered.

Message queues (Kafka, SQS, RabbitMQ): use for fan-out (one event, many consumers), decoupling services, or smoothing traffic spikes.

### Consistency models
- **Strong consistency**: every read sees the latest write. Cost: latency, availability under partition.
- **Eventual consistency**: reads may lag writes by milliseconds to seconds. Cost: complexity, stale reads.

Rule of thumb: financial transactions and user auth need strong consistency. Feed ordering, notification delivery, and analytics can tolerate eventual consistency.

---

## Common traps at PM/Director level

**Trap 1: Skipping requirements and jumping to architecture**
State your requirements first. Every architecture choice should trace back to a requirement. "I chose Cassandra because our write volume is 50k/sec and we can tolerate eventual consistency on the feed" is good. "I chose Cassandra because it scales" is not.

**Trap 2: Over-engineering for scale you don't have**
Don't design for 1B users if the prompt is a startup. State your scale assumptions and design for those. Show you'd revisit as the system grows.

**Trap 3: No failure mode**
State what happens when a component fails. Every distributed system has a failure mode. Strong candidates say "if the notification service goes down, messages are still delivered — notifications are eventually consistent and retry from the queue."

**Trap 4: No monitoring story**
Name what you'd instrument. At minimum: error rate, latency p99, queue depth, cache hit rate. Interviewers at senior level probe here.

**Trap 5: Treating the data model as an afterthought**
The schema is where most architectural mistakes live. Spend time here. A badly modelled entity causes scale problems that are expensive to fix later.

---

## Connecting to Chandan's experience

| Systems challenge | Your proof point |
|---|---|
| Offline / degraded connectivity states | HP field service — offline-first design, partial states, sync on reconnect |
| Audit trails and compliance | Stryker — serial/lot tracking, visit lifecycle, auditable close |
| Real-time status vs. async updates | Stryker — order status vs. part-at-site state distinction |
| AI/ML inference in the user path | HP — AI recommendation states, latency sensitivity, override recovery |
| Multi-tenant data isolation | BYJU's — US + IN data, 8 countries, compliance requirements |

The bridge from your UX experience to systems design is: you've thought deeply about what data the user needs and when. That's requirements. Systems design is requirements → architecture.

---

## Senior signal phrases

- "My scale assumption is [X] — that drives the storage choice"
- "I'm choosing eventual consistency here because [user impact is acceptable / business requirement]"
- "The failure mode I'm most worried about is [X] — here's the mitigation"
- "I'd instrument [X] on day one because it's the earliest signal of [Y]"
- "This is a place where I'd want to revisit the architecture at 10x scale — right now the simpler approach is fine"
- "The boundary between [service A] and [service B] matters because [reason] — crossing it has a real cost"
