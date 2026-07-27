---
name: implement-task
description: Implements exactly one approved task from tasks.md while respecting the project's specifications, architecture, engineering standards, Steering documents, and ADRs.
---

# Purpose

Implement exactly one approved task from `tasks.md`.

The objective is to produce production-ready code that fully complies with:

- requirements.md
- design.md
- tasks.md
- All Steering documents
- All approved ADRs

This skill must only be used after the specification has been reviewed and approved.

---

# Responsibilities

Before writing any code:

1. Read and understand:
   - requirements.md
   - design.md
   - tasks.md
   - Steering documents
   - Approved ADRs

2. Understand the objective of the current task.

3. Determine the minimum implementation required to satisfy the task.

Only then begin implementation.

---

# Scope Enforcement

The current task defines the implementation scope.

Implement **only** what is explicitly required by the current task.

Never implement future tasks in advance.

Never anticipate future requirements.

Never redesign the approved architecture.

Never modify public contracts unless explicitly requested.

Never add functionality outside the task scope.

If you identify missing infrastructure, tooling, configuration, documentation, or future work that is unrelated to the current task:

- Do not implement it.
- Do not request permission to implement it.
- Ignore it unless it blocks the current task.

Only raise issues that prevent successful completion of the current task.

---

# Architecture Rules

Always respect:

- Clean Architecture
- Lightweight DDD
- Module boundaries
- Dependency rules
- Layer responsibilities
- Shared Platform principles
- Offline-first principles where applicable

Business logic belongs only in the Domain layer.

Application orchestrates.

Infrastructure implements external concerns.

Presentation never contains business rules.

---

# Implementation Principles

Always:

- Implement the smallest solution that satisfies the task.
- Prefer simple solutions over complex ones.
- Prefer explicit code.
- Prefer composition over unnecessary abstraction.
- Follow existing project conventions.
- Keep modules cohesive.
- Keep code readable.
- Use strong typing.
- Maintain consistency with the rest of the codebase.

Never:

- Overengineer.
- Speculate about future requirements.
- Introduce unnecessary abstractions.
- Duplicate business rules.
- Leave TODO or FIXME comments.
- Modify unrelated code.

---

# Handling Ambiguity

If documentation is inconsistent or incomplete:

1. Verify whether the ambiguity actually blocks the current task.

If it does NOT block implementation:

- Choose the smallest implementation consistent with:
  - requirements.md
  - design.md
  - tasks.md

Continue working.

If the ambiguity DOES block implementation:

STOP.

Explain:

- what is ambiguous
- why it blocks the task
- which document contains the ambiguity
- what clarification is required

Do not guess business rules.

---

# Decision Making

When multiple valid implementations exist:

Choose the implementation that is:

- simplest
- smallest
- easiest to maintain
- fully compliant with the approved architecture

Avoid optimizing for hypothetical future needs.

Avoid creating structures that belong to future tasks.

---

# Code Quality

Generated code must be:

- Production ready
- Strongly typed
- Readable
- Maintainable
- Cohesive
- Consistent
- Well organized

Avoid unnecessary comments.

Write self-explanatory code whenever possible.

---

# Testing

Implement every test required by the current task.

When specified:

- Unit Tests
- Integration Tests
- Property-Based Tests
- Correctness Property validation

Tests are part of the implementation.

They are never optional.

---

# Validation Checklist

Before completing the task verify:

- Requirements satisfied
- Design respected
- Architecture respected
- Module boundaries preserved
- No unrelated code modified
- Project compiles
- TypeScript strict passes
- ESLint passes
- Tests pass
- Documentation updated if required
- No unfinished work remains

---

## Completion Report

At the end of every task, provide:

- Task implemented
- Files created
- Files modified
- Tests added or updated
- Requirements satisfied
- Design sections implemented
- ADRs respected
- Assumptions made
- Technical debt introduced (if any)
- Confirmation that no future tasks were implemented

---

## Project Scaffolding

If a task only requests creating directories or project structure:

- Create only the directories explicitly required.
- Do not create placeholder files.
- Do not create barrel files.
- Do not create README files.
- Do not create .gitkeep files unless the repository cannot preserve empty directories.
- Do not create any source code.

---

## Respect the Approved Project Structure

The implementation must follow the directory structure defined in the Design Document.

- Do not introduce additional directory levels that are not explicitly defined.
- Do not reorganize files for personal preference.
- If the design specifies a location, use that location.
- If the design is silent, choose the simplest structure that satisfies the current implementation.

---

# Completion Criteria

A task is complete only when:

- All acceptance criteria are satisfied.
- The implementation follows requirements.md.
- The implementation follows design.md.
- The implementation follows tasks.md.
- All Steering documents are respected.
- All approved ADRs are respected.
- All validations succeed.

When the task is complete:

- Stop.
- Do not continue to the next task.
- Wait for review and approval.

Never automatically continue with another task.