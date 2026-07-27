# ADR-003: Clean Architecture with Lightweight Domain-Driven Design

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** Nova Platform Architecture Team

---

# Context

Nova Platform consists of multiple business domains that will evolve independently over time while sharing a common platform.

The architecture must:

- Support long-term maintainability.
- Isolate business rules from infrastructure concerns.
- Enable independent evolution of modules.
- Facilitate testing.
- Minimize coupling.
- Maximize cohesion.
- Remain understandable for developers joining the project.

A full Domain-Driven Design implementation introduces unnecessary complexity for the current scale of the platform, while a traditional layered architecture does not provide sufficient separation of concerns.

---

# Decision

Nova Platform adopts **Clean Architecture** combined with **Lightweight Domain-Driven Design (DDD)**.

Each business module is organized into explicit architectural layers:

- Domain
- Application
- Infrastructure
- Presentation (when applicable)

The Domain layer owns all business rules.

The Application layer orchestrates business use cases.

The Infrastructure layer implements external dependencies.

The Presentation layer is responsible only for user interaction and request handling.

Dependencies must always point inward toward the Domain layer.

---

# Consequences

## Positive

- Business rules remain independent of frameworks.
- High testability.
- Explicit separation of responsibilities.
- Easier maintenance.
- Improved module cohesion.
- Reduced coupling.
- Clear architectural boundaries.
- Easier future extraction into independent services.

## Negative

- More files compared to traditional architectures.
- Slightly higher learning curve.
- Requires architectural discipline.
- Additional abstractions for small features.

---

# Alternatives Considered

## Traditional Layered Architecture

Rejected because:

- Business logic tends to migrate into services or controllers.
- Higher coupling between application and infrastructure.
- Reduced long-term maintainability.

## Full Tactical DDD

Rejected because:

- Excessive complexity for the current project.
- Higher development overhead.
- Many DDD tactical patterns are unnecessary at this stage.

---

# Rationale

Clean Architecture provides clear separation of responsibilities while Lightweight DDD introduces only the domain modeling concepts that add measurable value.

This combination keeps the codebase maintainable without introducing unnecessary complexity.

The architecture is intentionally pragmatic rather than academically complete.

---

# Architectural Principles

Every module must follow these principles:

- Business rules belong only in the Domain layer.
- Domain must not depend on Infrastructure.
- Infrastructure implements interfaces defined by Domain or Application.
- Application coordinates use cases without containing business rules.
- Presentation never implements business logic.
- Dependencies always point inward.
- Modules communicate through explicit contracts.

---

# Implementation Notes

Typical module structure:

```text
organization/

├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   ├── events/
│   └── validation/
│
├── application/
│   ├── commands/
│   ├── queries/
│   ├── handlers/
│   ├── dto/
│   └── mappers/
│
├── infrastructure/
│   ├── persistence/
│   ├── synchronization/
│   ├── repositories/
│   └── adapters/
│
└── presentation/
    ├── api/
    └── ui/
```

The exact internal organization may evolve, but layer responsibilities must remain unchanged.

---

# Related Documents

- product.md
- structure.md
- tech.md
- process.md
- ADR-001 Modular Monolith
- ADR-002 Offline-First Architecture