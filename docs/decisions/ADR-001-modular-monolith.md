# ADR-001: Modular Monolith Architecture

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** Nova Platform Architecture Team

---

# Context

Nova Platform is being developed as a multi-product SaaS platform that will support multiple business domains, including:

- Nova POS
- Nova GanaMás
- Future products

The platform requires:

- Clear domain boundaries
- Independent business modules
- Shared platform services
- Low operational complexity
- Fast development cycles
- Simple deployments
- The ability to evolve individual modules over time

At the current stage of the project, the expected scale does not justify the operational complexity of a microservices architecture.

---

# Decision

Nova Platform will be implemented as a **Modular Monolith**.

Each business capability will be implemented as an isolated module with explicit boundaries while being deployed as a single application.

Modules communicate through well-defined interfaces rather than direct internal coupling.

Shared platform capabilities (Organization, Audit, Synchronization, Configuration, etc.) are implemented as independent platform modules.

---

# Consequences

## Positive

- Lower infrastructure cost.
- Simpler deployments.
- Easier local development.
- Strong compile-time safety.
- Easier refactoring.
- Faster onboarding for developers.
- Reduced operational overhead.
- High cohesion within modules.
- Explicit module boundaries.

## Negative

- Requires architectural discipline to avoid tight coupling.
- Module boundaries must be enforced by code reviews and architecture rules.
- Future extraction into microservices requires maintaining strict separation between modules.

---

# Alternatives Considered

## Microservices

Rejected because:

- Higher operational complexity.
- Increased deployment complexity.
- Distributed transactions.
- Network latency.
- Higher infrastructure cost.
- Premature optimization for the current project stage.

## Traditional Layered Monolith

Rejected because:

- Weak domain boundaries.
- Higher coupling between business capabilities.
- More difficult long-term evolution.

---

# Rationale

The Modular Monolith provides the best balance between maintainability, simplicity, scalability, and development speed for Nova Platform.

The architecture preserves clear module boundaries today while allowing selected modules to be extracted into independent services in the future if business or scalability requirements justify it.

---

# Implementation Notes

- Each domain is implemented as an independent module.
- Modules own their business rules.
- Cross-module communication occurs through explicit interfaces.
- Shared platform services are reusable across products.
- Clean Architecture principles must be respected within every module.
- Module boundaries are enforced through Steering documents, ADRs, and code reviews.

---

# Related Documents

- product.md
- structure.md
- tech.md
- process.md
- ADR-003 Clean Architecture
- ADR-004 Platform Services