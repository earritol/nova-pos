# ADR-007 — Application Service Pattern

**Status:** Approved

**Date:** 2026-07-28

---

# Context

As Nova Platform grows, every domain exposes multiple use cases.

Without a consistent entry point, Presentation layers would need to know individual use cases, increasing coupling and reducing consistency across products.

During the implementation of CORE-002 (Terminal Management), a consistent orchestration pattern emerged.

A single Application Service became the public interface for each domain.

---

# Decision

Every domain shall expose exactly one Application Service.

Presentation layers interact only with the Application Service.

Application Services coordinate:

- Use Cases
- Repository interactions
- Synchronization
- Auditing
- Transactions (when applicable)

Business rules remain inside the Domain layer.

Application Services act as orchestration façades and must remain thin.

---

# Responsibilities

Application Services may:

- Execute use cases.
- Coordinate multiple repositories.
- Trigger synchronization.
- Trigger auditing.
- Return Result<T>.
- Coordinate transactions.

Application Services must NOT:

- Implement business rules.
- Validate domain invariants.
- Access persistence directly.
- Expose infrastructure details.

---

# Architectural Flow

```
Presentation
        │
        ▼
Application Service
        │
        ▼
Use Cases
        │
        ▼
Repository Contracts
        │
        ▼
Infrastructure
```

---

# Benefits

- Single public entry point.
- Reduced coupling.
- Consistent API.
- Easier dependency injection.
- Easier testing.
- Better separation of responsibilities.

---

# Consequences

Positive

- Predictable architecture.
- Consistent implementation across domains.
- Simpler Presentation layer.
- Better scalability.

Negative

- Small amount of additional boilerplate.

The benefits outweigh the additional structure.

---

# Alternatives Considered

## Presentation calling Use Cases directly

Rejected.

Presentation would need knowledge of every use case.

---

## Fat Application Services

Rejected.

Business rules belong in the Domain.

---

## Domain Services as façade

Rejected.

Domain Services should represent business concepts rather than orchestration.

---

# Compliance

Every future CORE should expose one Application Service.

Presentation must never:

- Access repositories directly.
- Execute infrastructure.
- Bypass the Application Service.

---

# Related ADRs

- ADR-001 Modular Monolith
- ADR-002 Offline First
- ADR-003 Clean Architecture
- ADR-004 Platform Services