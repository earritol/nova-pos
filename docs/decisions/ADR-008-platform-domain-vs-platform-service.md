# ADR-008 — Platform Domain vs Platform Service

**Status:** Approved

**Date:** 2026-07-28

---

# Context

As Nova Platform evolved, a distinction became necessary between reusable business capabilities and reusable technical capabilities.

Initially, Organization was considered a Platform Service.

During CORE-002 it became clear that Organization owns business entities, business rules, and business workflows.

Therefore it should not be classified as a technical service.

---

# Decision

Nova Platform distinguishes between Platform Domains and Platform Services.

---

# Platform Domain

A Platform Domain owns business capabilities that are shared by multiple products.

A Platform Domain may contain:

- Aggregates
- Entities
- Value Objects
- Business Rules
- Repository Contracts
- Use Cases
- Application Services

Examples:

- Organization

Future examples:

- Identity
- Licensing

Platform Domains own business logic.

---

# Platform Service

A Platform Service provides reusable technical capabilities.

A Platform Service contains no business rules.

Examples:

- Synchronization
- Audit
- Configuration

Future examples:

- Notifications
- Search
- Monitoring
- File Storage

Platform Services support business domains but never own them.

---

# Relationship

```
Nova Platform

├── Platform Domains
│
│   └── Organization
│
├── Platform Services
│
│   ├── Synchronization
│   ├── Audit
│   └── Configuration
│
└── Products
    │
    ├── Nova POS
    └── Nova GanaMás
```

---

# Ownership Rules

Every business capability belongs to exactly one owner.

If the capability contains business rules:

→ Platform Domain

If the capability only provides technical infrastructure:

→ Platform Service

Business ownership should never be ambiguous.

---

# Benefits

- Clear ownership.
- Better domain boundaries.
- Reduced architectural ambiguity.
- Easier long-term evolution.
- Better alignment with Domain-Driven Design.

---

# Consequences

Positive

- Cleaner Context Map.
- Clear separation of responsibilities.
- Better scalability.

Negative

- Requires careful classification of new capabilities.

---

# Decision Guidelines

When introducing a new capability:

Question 1

Does it contain business rules?

If yes:

→ Domain

---

Question 2

Is it reusable technical infrastructure?

If yes:

→ Platform Service

---

Question 3

Will multiple products consume it?

If yes:

Consider promoting it to a Platform Domain or Platform Service depending on ownership.

---

# Compliance

Every new shared capability must be classified as either:

- Platform Domain
- Platform Service

Never both.

---

# Related ADRs

- ADR-003 Clean Architecture
- ADR-004 Platform Services
- ADR-007 Application Service Pattern