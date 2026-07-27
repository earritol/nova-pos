# Project Structure Steering

Nova Platform uses a monorepo architecture.

---

# Root Structure

```
apps/
packages/
docs/
infrastructure/
.kiro/
```

---

# apps

Contains executable applications.

Examples:

- admin
- pos
- ganamas

Applications must remain independent.

Applications orchestrate user interaction but should contain minimal business logic.

---

# packages

Contains reusable libraries shared across applications.

Example packages:

- ui
- shared
- types
- utils

Business logic should never be duplicated.

---

# Domain Modules

Business logic is organized by domain.

Recommended structure:

```
packages/shared/domains/

organization/
    domain/
    application/
    infrastructure/

authentication/
products/
inventory/
sales/
customers/
```

Each domain owns:

- Domain Model
- Use Cases
- Repositories
- Infrastructure Implementations
- Tests

---

# Layer Responsibilities

Each domain follows the same architecture.

```
Domain
    ↓
Application
    ↓
Infrastructure
    ↓
Presentation
```

Responsibilities:

Domain

- Entities
- Value Objects
- Aggregates
- Domain Services
- Repository Interfaces
- Business Rules

Application

- Use Cases
- Orchestration
- Transactions

Infrastructure

- Database
- APIs
- Supabase
- IndexedDB
- External Services

Presentation

- UI
- Forms
- Components
- Screens

---

# Dependency Rules

Allowed dependencies:

Application
→ Domain

Infrastructure
→ Domain

Presentation
→ Application

Forbidden:

Domain
→ Infrastructure

Domain
→ UI

Application
→ UI

Infrastructure
→ Presentation

Packages must never depend on applications.

Applications may depend on packages.

---

# docs

Contains architectural documentation.

Documentation is the source of truth.

Examples:

- Architecture
- ADRs
- Diagrams
- Decisions

---

# .kiro

Contains AI-assisted development artifacts.

```
.kiro/

steering/

specs/
```

Steering provides permanent project knowledge.

Specifications describe individual epics.

---

# Specification Workflow

Every epic follows the same workflow.

```
requirements.md

↓

design.md

↓

tasks.md

↓

implementation
```

Design must be approved before implementation begins.

---

# Naming

Folders use kebab-case.

Types use PascalCase.

Interfaces use PascalCase.

Variables use camelCase.

Constants use UPPER_SNAKE_CASE.

---

# Code Organization

Business logic belongs to domain modules.

UI should never contain business rules.

Infrastructure remains isolated.

Shared code belongs in packages.

Favor composition over inheritance.

---

# General Principles

Small modules.

Small files.

Clear ownership.

Explicit dependencies.

High cohesion.

Low coupling.