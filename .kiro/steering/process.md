# Development Process Steering

## Purpose

This document defines the official development workflow for Nova Platform.

All AI-generated specifications and implementations must follow this process.

The goal is to ensure consistency, maintainability, architectural integrity, and predictable delivery across every domain.

---

# Development Lifecycle

Every feature, epic, or platform capability follows the same lifecycle.

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

Implementation must never skip any stage.

---

# Specification Workflow

Every specification consists of exactly three documents.

```
requirements.md
```

Defines:

- Business requirements
- Business rules
- Acceptance criteria
- Scope

↓

```
design.md
```

Defines:

- Architecture
- Domain model
- Aggregates
- Value Objects
- Use Cases
- State transitions
- Correctness Properties
- Testing strategy

↓

```
tasks.md
```

Defines:

- Implementation roadmap
- Execution order
- Dependencies
- Traceability

No implementation should begin before these three documents are approved.

---

# Architecture Reviews

Architecture reviews occur twice.

## Architecture Review Goals

Architecture reviews validate more than code quality.

Each review should confirm:

- Architectural consistency.
- Dependency direction.
- Domain boundaries.
- Reuse of existing Platform Services.
- Compliance with approved ADRs.
- Preservation of Offline First principles.

## First Review

After requirements.md

Purpose:

- Validate business understanding
- Detect missing requirements
- Refine boundaries

---

## Second Review

After design.md

Purpose:

- Validate architecture
- Validate DDD model
- Validate dependency direction
- Validate testing strategy
- Validate correctness properties

Only after approval should tasks.md be generated.

---

# Implementation Rules

Implement one task at a time.

Do not automatically continue to the next task.

Each task should leave the project in a working state.

Never implement functionality that is not described in:

- requirements.md
- design.md
- tasks.md

If ambiguity exists:

Stop.

Ask for clarification.

Never guess business rules.

---

## Incremental Implementation

Large implementations should be divided into small implementation waves.

Each wave should:

- Preserve a working state.
- Compile successfully.
- Keep tests passing.
- Be reviewed before continuing when the implementation is architecturally significant.

Incremental reviews reduce architectural drift and improve long-term maintainability.

---

# Code Generation Principles

Generated code should:

- Respect Clean Architecture
- Respect Lightweight DDD
- Respect Dependency Inversion
- Respect Offline First
- Respect Multi-Tenant
- Prefer composition over inheritance
- Keep modules cohesive
- Keep responsibilities explicit

Business logic belongs in the Domain Layer.

UI must remain thin.

Infrastructure implements abstractions.

---

# Definition of Done

A task is considered complete only if all of the following are true.

✓ Code compiles successfully

✓ TypeScript strict mode passes

✓ ESLint passes without errors

✓ No unused code

✓ No TODO placeholders

✓ No FIXME placeholders

✓ No unnecessary comments

✓ Public APIs remain consistent

✓ Tests pass

✓ Documentation updated when required

If any condition is not satisfied, the task is not complete.

---

# Testing Requirements

Every implementation must include appropriate testing.

Minimum expectations:

- Unit Tests
- Integration Tests where applicable
- Property-Based Tests for critical business rules

Critical domain behavior must always be verified.

Correctness Properties defined in design.md must be implemented as Property-Based Tests.

---

# Pull Request Requirements

Every Pull Request should:

- Implement only the intended scope
- Keep commits focused
- Preserve architectural boundaries
- Avoid unrelated refactoring
- Include tests
- Keep documentation synchronized

Large Pull Requests should be avoided.

---

# Refactoring Rules

Refactoring is encouraged when it:

- Improves readability
- Reduces duplication
- Simplifies implementation

Refactoring must not:

- Change business behavior
- Introduce new features
- Break public contracts
- Modify architecture without approval

---

# Documentation Synchronization

Implementation must remain synchronized with documentation.

If implementation requires changing:

- requirements.md
- design.md
- tasks.md

Implementation should stop until the specification is updated and approved.

Documentation is the source of truth.

---

# AI Collaboration Guidelines

When generating code:

- Prefer small incremental changes.
- Prefer explicit code over clever code.
- Keep functions small.
- Keep files focused.
- Preserve architectural consistency.
- Ask questions whenever requirements are unclear.
- Never invent business rules.
- Never silently change approved designs.

The objective is correctness, maintainability, and long-term evolution rather than short-term implementation speed.

---

# Continuous Improvement

After completing an epic:

- Review lessons learned.
- Update steering documents if recurring patterns emerge.
- Create ADRs for significant architectural decisions.
- Improve templates before starting the next epic.

The development process should evolve continuously while maintaining consistency across the platform.

---

## Architectural Stability

Approved architecture should remain stable during implementation.

Implementation should adapt to the approved design.

If implementation reveals a significant architectural issue:

- Stop implementation.
- Update the specification.
- Review the architectural change.
- Continue only after approval.

Architectural redesign should never happen implicitly during coding.