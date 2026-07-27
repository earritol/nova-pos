# ADR-005: Property-Based Testing for Critical Business Rules

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** Nova Platform Architecture Team

---

# Context

Nova Platform contains critical business rules whose correctness cannot be sufficiently validated through a small number of example-based tests.

Examples include:

- Inventory calculations
- Sales totals
- Tax calculations
- Loyalty rules
- Synchronization logic
- Validation rules

Traditional unit tests verify known scenarios but may fail to detect unexpected edge cases.

---

# Decision

Critical domain rules will be validated using **Property-Based Testing** in addition to traditional unit and integration tests.

Each domain specification should identify its Correctness Properties.

Property-Based Tests become part of the implementation whenever a specification defines such properties.

---

# Consequences

## Positive

- Higher confidence in business rules.
- Better edge-case detection.
- Improved regression protection.
- More robust domain models.

## Negative

- Higher learning curve.
- Longer test execution.
- Additional maintenance.

---

# Alternatives Considered

## Unit Tests Only

Rejected because:

- Limited scenario coverage.
- Edge cases may remain undiscovered.

## Manual Testing

Rejected because:

- Not repeatable.
- Not scalable.
- High maintenance cost.

---

# Rationale

Property-Based Testing validates invariant business behavior rather than isolated examples.

This approach provides significantly stronger guarantees for mission-critical business logic.

---

# Implementation Notes

Correctness Properties must be documented during the design phase.

Property-Based Tests complement Unit and Integration Tests.

Not every module requires Property-Based Tests.

Only domains with meaningful business invariants should implement them.

---

# Related Documents

- process.md
- implementation.md
- ADR-003 Clean Architecture