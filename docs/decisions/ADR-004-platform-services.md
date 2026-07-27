# ADR-004: Shared Platform Services

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** Nova Platform Architecture Team

---

# Context

Nova Platform is a multi-product SaaS platform composed of multiple business applications.

Several capabilities are shared across products and should not be duplicated inside individual business modules.

Examples include:

- Organization Management
- User Management
- Configuration
- Audit
- Synchronization
- Notifications
- Feature Flags

Duplicating these capabilities would increase maintenance costs and create inconsistent behavior across products.

---

# Decision

Shared capabilities will be implemented as **Platform Services**.

A Platform Service provides reusable functionality that can be consumed by multiple business domains without becoming part of their business logic.

Platform Services own their own domain model, persistence, APIs, and lifecycle.

Business modules depend on Platform Services through explicit interfaces rather than direct implementation details.

---

# Consequences

## Positive

- Eliminates duplicated functionality.
- Consistent behavior across products.
- Easier maintenance.
- Clear ownership of shared capabilities.
- Improved modularity.

## Negative

- Requires careful interface design.
- Platform services must avoid becoming tightly coupled to business modules.
- Changes may affect multiple products.

---

# Alternatives Considered

## Duplicating shared functionality

Rejected because:

- Creates inconsistent implementations.
- Higher maintenance effort.
- Difficult evolution.

## Large shared utility libraries

Rejected because:

- Encourages hidden coupling.
- Poor ownership.
- Difficult governance.

---

# Rationale

Platform Services provide a clear separation between reusable platform capabilities and product-specific business logic.

This enables product teams to evolve independently while sharing common platform functionality.

---

# Implementation Notes

Examples of Platform Services:

- Organization
- Identity
- Audit
- Configuration
- Synchronization
- Notifications

Platform Services may depend on one another only through explicit contracts.

Business modules must never bypass Platform Services.

---

# Related Documents

- product.md
- structure.md
- tech.md
- ADR-001 Modular Monolith
- ADR-003 Clean Architecture