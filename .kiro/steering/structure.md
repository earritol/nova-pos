# Project Structure Steering

Nova Platform uses a monorepo architecture.

## Root Structure

```
apps/
packages/
docs/
specs/
infrastructure/
```

---

## apps

Contains executable applications.

Examples:

- admin
- pos
- ganamas

Applications must remain independent.

---

## packages

Contains reusable libraries shared across applications.

Examples:

- ui
- shared
- types
- utils

Business logic should not be duplicated.

---

## docs

Contains product documentation.

Documentation is the source of truth.

---

## specs

Every epic has its own specification.

Example:

specs/

CORE-001/

requirements.md

design.md

tasks.md

Specifications should remain independent.

---

## infrastructure

Infrastructure as Code.

Deployment.

Cloud resources.

Configuration.

---

## Naming

Folders use kebab-case.

Types use PascalCase.

Variables use camelCase.

Constants use UPPER_SNAKE_CASE.

---

## Code Organization

Business logic belongs to domain modules.

UI should never contain business logic.

Infrastructure should be isolated.

Shared code belongs in packages.

---

## Dependencies

Applications may depend on packages.

Packages must never depend on applications.

Documentation should never depend on implementation.

Specifications describe implementation but are not implementation.
