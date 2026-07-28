# Nova Platform CORE Development Lifecycle
Version: 1.0
Status: Approved

---

# Purpose

This document describes the complete lifecycle for developing a CORE within Nova Platform.

It complements the official development process defined in the Steering documents by providing practical guidance for planning, reviewing, implementing, and completing a CORE.

Every CORE should follow this lifecycle regardless of its size.

---

# What is a CORE?

A CORE is a self-contained business capability that extends the platform.

A CORE:

- Delivers a cohesive set of functionality.
- Has a well-defined domain boundary.
- Produces reusable platform capabilities when appropriate.
- Preserves architectural consistency.
- Can be independently reviewed.

Examples:

- CORE-001 Foundation
- CORE-002 Terminal Management
- CORE-003 Organization Management

A CORE should never mix unrelated business capabilities.

---

# Development Lifecycle

Every CORE follows the same lifecycle.

```
Idea
    ↓
Requirements
    ↓
Architecture Review
    ↓
Design
    ↓
Architecture Review
    ↓
Tasks
    ↓
Architecture Review
    ↓
Implementation (Incremental Waves)
    ↓
Architecture Review
    ↓
Pull Request
    ↓
Code Review
    ↓
Merge
```

No stage should be skipped.

---

# Phase 0 — Domain Discovery

Purpose

Understand the business domain before writing requirements.

Deliverables

- discovery.md

Contents

- Domain concepts
- Domain boundaries
- Ownership
- Relationships
- Future consumers
- Out of scope
- Open questions

Output

Shared understanding of the domain.

Discovery is exploratory.

It does not define implementation requirements.

Requirements are written only after Discovery has been reviewed.

---

# Phase 1 — Requirements

Purpose

Define the business problem.

Deliverables

- requirements.md

Contents

- Functional requirements
- Business rules
- Acceptance criteria
- Scope
- Non-scope

Output

Approved requirements.

---

# Phase 2 — Architecture Review

Purpose

Validate business understanding before designing the solution.

Review includes

- Missing requirements
- Domain boundaries
- Product ownership
- Platform ownership
- Scope validation

Output

Approved Requirements.

---

# Phase 3 — Design

Purpose

Transform requirements into an architectural design.

Deliverables

- design.md

Contents

- Domain model
- Aggregates
- Value Objects
- Use Cases
- State transitions
- Repository contracts
- Correctness Properties
- Testing strategy

Output

Approved design.

---

# Phase 4 — Architecture Review

Purpose

Validate the proposed architecture.

Review focuses on

- Clean Architecture
- DDD
- Dependency direction
- Aggregate boundaries
- Offline First
- Multi-Tenant
- Platform reuse

Output

Approved design.

---

# Phase 5 — Tasks

Purpose

Break the design into incremental implementation tasks.

Deliverables

- tasks.md

Tasks should

- Be ordered.
- Be traceable.
- Be independently executable.
- Leave the project in a working state.

Output

Approved task plan.

---

# Phase 6 — Architecture Review

Purpose

Validate implementation strategy before coding begins.

Review confirms

- Task ordering
- Incremental delivery
- Dependency flow
- Test strategy
- Implementation boundaries

Output

Approved implementation plan.

---

# Phase 7 — Incremental Implementation

Implementation should be divided into small waves.

Typical implementation order:

Wave 0

- Project structure
- Infrastructure preparation

Wave 1

- Domain model

Wave 2

- Validation
- Lifecycle

Wave 3

- Repository contracts

Wave 4

- Application layer

Wave 5

- Local infrastructure

Wave 6

- Remote infrastructure

Wave 7

- Synchronization

Wave 8

- Audit

Wave 9

- Presentation

Wave 10

- Unit Tests

Wave 11

- Property-Based Tests

Wave 12

- Documentation

Wave 13

- Cleanup

Not every CORE requires the same number of waves.

Large COREs should remain incremental.

---

# Wave Reviews

Every implementation wave should end in a review.

Review objectives

- Preserve architecture.
- Detect architectural drift.
- Validate dependency direction.
- Detect unnecessary abstractions.
- Ensure documentation remains valid.

Only continue after review approval.

---

# Definition of Done

A CORE is complete only when:

- All requirements are implemented.
- All business rules are enforced.
- Design has been fully implemented.
- Tasks have been completed.
- Tests pass.
- Documentation is updated.
- No architectural deviations exist.
- Code Review has been approved.
- Merge is approved.

---

# Architecture Preservation

Implementation should adapt to the approved architecture.

Architecture should not evolve during implementation unless:

- A significant issue is discovered.
- The specification is updated.
- The architecture review is repeated.
- The change is approved.

Major architectural decisions require an ADR.

---

# Testing Strategy

Every CORE should include:

- Unit Tests
- Integration Tests where appropriate
- Property-Based Tests for critical business rules

Every Correctness Property defined in design.md should have a corresponding automated test whenever feasible.

Testing is considered part of the implementation.

---

# Documentation

Every completed CORE should update documentation when required.

Possible updates include:

- Platform Architecture
- Context Map
- Platform Services
- Roadmap
- ADRs
- Steering

Documentation should always reflect the current platform.

---

# Final Review

Before merge, perform a complete architectural review.

The review should confirm:

- Architectural consistency
- Platform consistency
- Domain boundaries
- Dependency rules
- Offline First compliance
- Testing completeness
- Documentation synchronization

Only after approval should the CORE be merged.

---

# Lessons Learned

After each completed CORE:

- Review implementation.
- Identify recurring patterns.
- Improve Steering documents.
- Create ADRs when necessary.
- Update architectural documentation.
- Improve templates for future COREs.

The platform should evolve through continuous improvement rather than architectural redesign.

---

# References

- Product Steering
- Structure Steering
- Technical Steering
- Process Steering
- Platform Architecture
- Context Map
- Platform Services
- Roadmap
- Approved ADRs