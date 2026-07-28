# Nova Platform Architecture
Version: 1.0
Status: Approved

---

# 1. Purpose

This document describes the architecture of Nova Platform.

It provides a high-level view of the platform, its architectural principles, major building blocks, dependency rules, and the interaction between products and shared platform services.

Implementation details belong to individual specifications (`requirements.md`, `design.md`, `tasks.md`) and Architecture Decision Records (ADRs).

---

# 2. Architectural Goals

Nova Platform is designed to achieve the following goals:

- Build independent business products on a shared platform.
- Maximize code reuse without sharing business rules.
- Support Offline First operation where required.
- Maintain clear architectural boundaries.
- Enable long-term evolution through incremental CORE modules.
- Keep business logic independent from infrastructure.
- Support multiple products within a single platform.

---

# 3. Platform Overview

Nova Platform consists of multiple independent products built on top of a common platform.

```
                   Nova Platform

        +-------------------------------+
        |       Shared Platform          |
        |-------------------------------|
        | Organization                  |
        | Synchronization               |
        | Audit                         |
        | Configuration                 |
        +---------------+---------------+
                        |
        +---------------+---------------+
        |                               |
+---------------+              +----------------+
|   Nova POS    |              | Nova GanaMás   |
+---------------+              +----------------+
```

Products remain independent while consuming shared platform capabilities.

Business rules never belong to shared infrastructure.

---

# 4. Architectural Principles

Nova Platform adopts the following architectural principles.

- Modular Monolith
- Lightweight Domain-Driven Design
- Clean Architecture
- Offline First
- Multi-Tenant
- Evolutionary Architecture

Architecture evolves incrementally through approved CORE modules.

---

# 5. Monorepo Organization

```
apps/
packages/
docs/
infrastructure/
.kiro/
```

## apps

Executable applications.

Examples:

- pos
- admin
- ganamas

## packages

Reusable platform libraries.

Typical packages include:

- shared
- ui
- types
- utils

## docs

Architecture documentation.

## infrastructure

Infrastructure provisioning.

## .kiro

AI-assisted project knowledge.

---

# 6. Layered Architecture

Every domain follows the same layered architecture.

```
Presentation
      ↓
Application
      ↓
Domain
      ↓
Infrastructure
```

## Presentation

Responsible for:

- User interaction
- Components
- Pages
- Forms

Presentation never contains business rules.

---

## Application

Responsible for:

- Use Case orchestration
- Repository coordination
- Audit coordination
- Synchronization coordination

Application contains workflows but never business rules.

---

## Domain

Responsible for:

- Aggregates
- Entities
- Value Objects
- Domain Services
- Business Rules
- Repository Contracts

The Domain layer is completely independent from infrastructure.

---

## Infrastructure

Responsible for:

- IndexedDB
- Supabase
- External APIs
- Repository implementations

Infrastructure adapts external technologies to the Domain.

---

# 7. Dependency Rules

Allowed dependencies:

```
Presentation
        ↓
Application
        ↓
Domain

Infrastructure
        ↓
Domain
```

Forbidden dependencies:

- Domain → Infrastructure
- Domain → Presentation
- Application → Presentation
- Packages → Applications

Dependencies always point toward abstractions.

---

# 8. Domain Module Structure

Every domain follows a consistent internal organization.

```
domain/
    entities/
    value-objects/
    lifecycle/
    validation/
    repositories/
    index.ts

application/
    use-cases/
    application-service.ts
    index.ts

infrastructure/
    local/
    remote/
    mappers/
    index.ts

presentation/

tests/
```

Not every module requires every folder, but the architectural structure should remain consistent across the platform.

---

# 9. Application Pattern

Each domain exposes a single Application Service.

```
UI

↓

Application Service

↓

Use Cases

↓

Repositories

↓

Infrastructure
```

Responsibilities:

- Coordinate use cases.
- Coordinate repositories.
- Coordinate synchronization.
- Coordinate auditing.
- Return Result<T>.

Business rules remain inside the Domain layer.

---

# 10. Offline First Architecture

Nova POS operates using an Offline First architecture.

Every write operation follows the same flow.

```
User Action

↓

Application

↓

Local Repository

↓

Synchronization Queue

↓

Audit

↓

Return Success

↓

Background Synchronization

↓

Supabase
```

User operations never wait for remote persistence.

---

# 11. Synchronization

Synchronization is handled by the shared platform.

Responsibilities include:

- Queue processing
- Retry
- Recovery
- Conflict detection
- Synchronization metadata

Domain modules never implement their own synchronization engine.

---

# 12. Shared Platform Services

Platform Services provide reusable technical capabilities.

Examples include:

- Organization Management
- Synchronization
- Audit
- Configuration

Platform Services must never contain product-specific business rules.

---

# 13. Testing Strategy

Every CORE follows the same testing strategy.

Minimum expectations:

- Unit Tests
- Integration Tests
- Property-Based Tests for critical business rules

Every Design document defines Correctness Properties.

Critical invariants should be validated through Property-Based Testing.

---

# 14. Architecture Decisions

Major architectural decisions are documented as ADRs.

Current approved ADRs include:

- ADR-001 Modular Monolith
- ADR-002 Offline First
- ADR-003 Clean Architecture
- ADR-004 Platform Services
- ADR-005 Property-Based Testing
- ADR-006 Supabase Platform

Future architectural changes should be introduced through additional ADRs.

---

# 15. CORE Evolution

Nova Platform evolves through independent CORE modules.

Each CORE should:

- Extend existing platform capabilities.
- Reuse existing Platform Services.
- Preserve architectural consistency.
- Avoid introducing new architectural patterns without an approved ADR.

Completed COREs become part of the permanent platform.

---

# 16. Current Platform Status

Completed:

- CORE-001 Foundation
- CORE-002 Terminal Management

Future COREs will continue expanding the platform while preserving the established architecture.

---

# 17. References

Project Steering:

- product.md
- structure.md
- tech.md
- process.md

Architecture Decision Records:

- docs/architecture/adr/

Specifications:

- requirements.md
- design.md
- tasks.md

This document provides the architectural overview for Nova Platform and should remain synchronized with all approved Steering documents and ADRs.